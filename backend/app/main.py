from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, whatsapp

app = FastAPI(
    title="AI Business Assistant API",
    description="API para el asistente de WhatsApp con IA para negocios",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(whatsapp.router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "AI Business Assistant API",
        "version": "0.1.0",
        "status": "running",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}