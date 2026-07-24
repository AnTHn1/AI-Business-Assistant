from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    whatsapp_number = Column(String(50), nullable=True)
    twilio_sid = Column(String(255), nullable=True)
    twilio_auth_token = Column(String(255), nullable=True)
    twilio_phone_number = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    welcome_message = Column(Text, nullable=True)
    
    # Contexto para la IA
    ai_context = Column(Text, nullable=True)  # Precios, horarios, servicios, etc.
    ai_enabled = Column(Boolean, default=True)  # IA activada/desactivada
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    conversations = relationship("Conversation", back_populates="business")

    def __repr__(self):
        return f"<Business {self.name}>"