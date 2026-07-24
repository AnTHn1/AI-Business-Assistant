import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.business import Business


def update_business_twilio():
    db = SessionLocal()
    try:
        business = db.query(Business).filter(Business.id == 1).first()
        if not business:
            print("Negocio no encontrado")
            return
        
        # Pega aquí tus credenciales de Twilio
        business.twilio_sid = "USce5cf5b4bf37df70ef6012552c02615f"  # Tu Account SID
        business.twilio_auth_token = "5e2492c49abf8ab4fb9270d0910eb058"  # Tu Auth Token
        business.twilio_phone_number = "+17157187289"  # Número de sandbox de Twilio
        
        db.commit()
        print(f"Negocio '{business.name}' actualizado con credenciales Twilio")
        
    finally:
        db.close()


if __name__ == "__main__":
    update_business_twilio()