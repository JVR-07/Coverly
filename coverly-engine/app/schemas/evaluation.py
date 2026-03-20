from pydantic import BaseModel
from typing import List, Optional

class ContextSchema(BaseModel):
    requestedProducts: List[str]

class EvaluateRequest(BaseModel):
    clientId: str
    context: ContextSchema
    economicProfile: Optional[dict] = None
    riskLevel: Optional[str] = None

class PromotionSchema(BaseModel):
    promotionId: str
    discountPercentage: float

class RecommendedProductSchema(BaseModel):
    productId: str
    name: str
    type: str
    matchScore: float
    reasons: List[str]
    appliedPromotions: List[PromotionSchema]
    finalPrice: float

class ExcludedProductSchema(BaseModel):
    productId: str
    name: str
    reason: str

class EvaluateResponse(BaseModel):
    recommendationId: str
    clientId: str
    status: str
    globalScore: float
    recommendedProducts: List[RecommendedProductSchema]
    excludedProducts: List[ExcludedProductSchema]
