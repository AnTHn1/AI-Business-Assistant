import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.business import Business


def create_test_business():
    db = SessionLocal()
    try:
        existing = db.query(Business).filter(Business.name == "Clinica Dental Demo").first()
        if existing:
            print(f"Negocio ya existe: {existing.name} (ID: {existing.id})")
            return
        
        business = Business(
            name="Clinica Dental Demo",
            whatsapp_number="+51999999999",
            welcome_message="¡Bienvenido a Clinica Dental! ¿En que puedo ayudarte?",
            is_active=True
        )
        
        db.add(business)
        db.commit()
        db.refresh(business)
        print(f"Negocio creado: {business.name} (ID: {business.id})")
        
    finally:
        db.close()


if __name__ == "__main__":
    create_test_business()