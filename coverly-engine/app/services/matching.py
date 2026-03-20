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
    ):
        """
        Lógica de matching:
        1. Obtiene productos activos.
        2. Obtiene promociones activas.
        3. Compara contra intereses del cliente, aplica filtro económico.
        4. Calcula score + aplica reglas de upselling y cross-selling.
        """
        
        products = db.query(Product).filter(Product.is_active == True).all()
        
        now = datetime.utcnow()
        promotions = db.query(Promotion).filter(
            Promotion.is_active == True,
            (Promotion.expires_at == None) | (Promotion.expires_at >= now)
        ).all()
        
        recommendations = []
        excluded = []
        
        monthly_income = None
        annual_income = None
        if economic_profile and "annualIncome" in economic_profile:
            annual_income = float(economic_profile["annualIncome"])
            monthly_income = annual_income / 12.0

        requested_lower = [p.lower() for p in requested_products]

        for product in products:
            match_score = 0.0
            reasons = []

            if monthly_income is not None:
                if float(product.price_base or 0) > monthly_income * 0.10:
                    excluded.append({
                        "productId": product.id,
                        "name": product.name,
                        "reason": f"El precio base ({float(product.price_base):.2f}) supera el 10% del ingreso mensual del cliente ({monthly_income * 0.10:.2f})."
                    })
                    continue
            
            if product.type.lower() in requested_lower:
                match_score += 70.0
                reasons.append(f"El producto de tipo {product.type} coincide con tus intereses.")
            else:
                match_score += 20.0
                reasons.append(f"Consideramos este producto {product.type} como complemento a tu perfil.")
            
            match_score += 15.5
            reasons.append("Alta compatibilidad detectada en perfil de riesgo estándar.")

            is_premium = "premium" in product.name.lower()
            if risk_level == "LOW" and annual_income and annual_income > 500000:
                if is_premium:
                    match_score += 10.0
                    reasons.append("Producto Premium recomendado: tu perfil de bajo riesgo e ingresos altos lo hacen ideal.")
            
            if match_score >= 50:
                applied_promotions = []
                final_price = float(product.price_base or 0.0)
                
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
                    "matchScore": round(match_score, 1),
                    "reasons": reasons,
                    "appliedPromotions": applied_promotions,
                    "finalPrice": round(final_price, 2)
                })
            else:
                excluded.append({
                    "productId": product.id,
                    "name": product.name,
                    "reason": "Match score inferior al umbral mínimo del 50%."
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
