from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.api.v1.router import api_router
from app.core.db import SessionLocal
from app.core.config import settings

app = FastAPI(
    title="Coverly Engine",
    description="Motor Inteligente para la asignación dinámica de riesgos y generación de recomendaciones.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "unreachable"
        return JSONResponse(
            status_code=503,
            content={"status": "degraded", "db": db_status, "service": "coverly-engine"}
        )
    return {"status": "healthy", "db": db_status, "service": "coverly-engine"}