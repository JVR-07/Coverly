from fastapi import APIRouter
from app.api.v1 import evaluation

api_router = APIRouter()

api_router.include_router(evaluation.router, prefix="/engine", tags=["evaluations"])
