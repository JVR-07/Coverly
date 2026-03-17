from fastapi import APIRouter
from app.schemas.evaluation import EvaluateRequest, EvaluateResponse
import uuid

router = APIRouter()

@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate_client(request: EvaluateRequest):
    """
    Recibe el perfil del cliente (o ID del cliente) para generar un scoring
    y devolver recomendaciones de seguros personalizadas estáticas (mock).
    En la siguiente iteración se conectará con un Scikit-Learn model.
    """
    
    return EvaluateResponse(
        recommendationId=str(uuid.uuid4()),
        clientId=request.clientId,
        status="generated",
        globalScore=85.5,
        recommendedProducts=[
            {
                "productId": str(uuid.uuid4()), 
                "name": "Seguro Auto Plus",
                "type": "auto",
                "matchScore": 92.4,
                "reasons": [
                    "Ingreso anual compatible con suma asegurada",
                    "Nivel de riesgo bajo (score alto) detectado"
                ],
                "appliedPromotions": [
                    {
                        "promotionId": str(uuid.uuid4()),
                        "discountPercentage": 10.0
                    }
                ],
                "finalPrice": 10800.0
            }
        ],
        excludedProducts=[
            {
                "productId": str(uuid.uuid4()),
                "name": "Seguro de Vida VIP",
                "reason": "Exclusión por edad máxima superior a lo permitido en reglamento."
            }
        ]
    )
