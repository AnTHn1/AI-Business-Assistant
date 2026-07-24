from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# === Esquemas base ===
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


# === Crear usuario (registro) ===
class UserCreate(UserBase):
    password: str  # Contraseña en texto plano, solo para entrada


# === Respuesta de usuario (nunca devuelve la contraseña) ===
class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Antes era orm_mode = True


# === Login ===
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# === Token JWT ===
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[int] = None  # El ID del usuario