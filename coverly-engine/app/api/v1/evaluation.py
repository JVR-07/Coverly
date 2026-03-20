from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.evaluation import EvaluateRequest, EvaluateResponse
from app.services.matching import MatchingService
from app.core.db import get_db
import uuid

router = APIRouter()

@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate_client(request: EvaluateRequest, db: Session = Depends(get_db)):
    """
    Recibe el perfil del cliente para generar un scoring
    y devolver recomendaciones de seguros personalizadas basadas en el catálogo real.
    """
    
    try:
        recommendations, excluded = MatchingService.get_recommendations(
            db=db, 
            requested_products=request.context.requestedProducts,
            economic_profile=request.economicProfile,
            risk_level=request.riskLevel
        )
        
        avg_score = sum(r["matchScore"] for r in recommendations) / len(recommendations) if recommendations else 0.0
        
        return EvaluateResponse(
            recommendationId=str(uuid.uuid4()),
            clientId=request.clientId,
            status="generated",
            globalScore=round(avg_score, 1),
            recommendedProducts=recommendations,
            excludedProducts=excluded
        )
    except Exception as e:
        print(f"Error en motor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Falla interna del motor: {str(e)}")

