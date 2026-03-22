from sqlalchemy.orm import Session
from app.models.core import Product, Promotion
from typing import List, Dict
from datetime import datetime

class MatchingService:
    @staticmethod
    def get_recommendations(
        db: Session,
        requested_products: List[str],
        economic_profile: Dict = None,
        risk_level: str = None,
        claims_history: int = None,
    ):
        """
        Motor de recomendación con scoring ponderado:
        S = (P × 0.40) + (N × 0.30) + (H × 0.20) + (R × 0.10)

        P = Perfil Económico (0-100)
        N = Necesidades (0-100)
        H = Historial (0-100)
        R = Riesgo (0-100)
        """

        products = db.query(Product).filter(Product.is_active == True).all()

        now = datetime.utcnow()
        promotions = db.query(Promotion).filter(
            Promotion.is_active == True,
            (Promotion.expires_at == None) | (Promotion.expires_at >= now)
        ).all()

        recommendations = []
        excluded = []

        annual_income = None
        monthly_income = None
        if economic_profile and "annualIncome" in economic_profile:
            annual_income = float(economic_profile["annualIncome"])
            monthly_income = annual_income / 12.0

        requested_lower = [p.lower() for p in requested_products]

        for product in products:
            price_base = float(product.price_base or 0)
            reasons = []

            if monthly_income is not None:
                if price_base > monthly_income * 0.10:
                    excluded.append({
                        "productId": product.id,
                        "name": product.name,
                        "reason": f"El precio base ({price_base:.2f}) supera el 10% del ingreso mensual del cliente ({monthly_income * 0.10:.2f})."
                    })
                    continue

            if annual_income and annual_income > 0:
                income_ratio = price_base / annual_income
                P = max(0.0, min(100.0, 100 - (income_ratio * 500)))
            else:
                P = 50.0

            if P >= 80:
                reasons.append("Este seguro representa un porcentaje mínimo de tus ingresos, garantizando estabilidad financiera.")
            elif P >= 50:
                reasons.append("El costo del seguro es accesible según tu perfil económico.")

            if product.type.lower() in requested_lower:
                N = 100.0
                reasons.append(f"El producto de tipo {product.type} coincide directamente con tus necesidades declaradas.")
            else:
                N = 0.0
                reasons.append(f"Producto {product.type} complementario a tu perfil.")

            if claims_history is not None:
                if claims_history == 0:
                    H = 90.0
                    reasons.append("Sin siniestros previos. Historial impecable.")
                elif claims_history <= 2:
                    H = 60.0
                else:
                    H = 30.0
                    reasons.append("Tu historial de siniestros reduce la puntuación.")
            else:
                H = 50.0

            risk_scores = {"LOW": 90.0, "MEDIUM": 60.0, "HIGH": 30.0}
            R = risk_scores.get(risk_level, 50.0)

            if risk_level == "LOW":
                reasons.append("Tu perfil de bajo riesgo te da acceso a mejores condiciones.")

            score = (P * 0.40) + (N * 0.30) + (H * 0.20) + (R * 0.10)

            is_premium = "premium" in product.name.lower()
            if risk_level == "LOW" and annual_income and annual_income > 500000:
                if is_premium:
                    score += 10.0
                    reasons.append("Producto Premium recomendado: tu perfil de bajo riesgo e ingresos altos lo hacen ideal.")

            if score >= 40:
                applied_promotions = []
                final_price = price_base

                for promo in promotions:
                    if promo.discount_percent:
                        applied_promotions.append({
                            "promotionId": promo.id,
                            "discountPercentage": float(promo.discount_percent)
                        })
                        discount = (final_price * float(promo.discount_percent)) / 100.0
                        final_price -= discount
                        break

                recommendations.append({
                    "productId": product.id,
                    "name": product.name,
                    "type": product.type,
                    "matchScore": round(score, 1),
                    "reasons": reasons,
                    "appliedPromotions": applied_promotions,
                    "finalPrice": round(final_price, 2)
                })
            else:
                excluded.append({
                    "productId": product.id,
                    "name": product.name,
                    "reason": f"Score de adecuación ({round(score, 1)}) inferior al umbral mínimo (40)."
                })

        recommendations.sort(key=lambda x: x["matchScore"], reverse=True)

        if "life" in requested_lower:
            best_hogar = next(
                (r for r in recommendations if r["type"].upper() == "FIRE"),
                None
            )
            if best_hogar:
                best_hogar["matchScore"] = round(best_hogar["matchScore"] * 1.05, 1)
                best_hogar["reasons"].append(
                    "Sugerencia cruzada: contratar Hogar junto con Vida ofrece mayor protección familiar integral."
                )
                recommendations.sort(key=lambda x: x["matchScore"], reverse=True)

        return recommendations, excluded
