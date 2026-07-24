from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./aibusiness.db"
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""  # <-- AGREGAR ESTA LÍNEA
    SECRET_KEY: str = "tu_secret_key_super_seguro_aqui_cambia_esto_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()