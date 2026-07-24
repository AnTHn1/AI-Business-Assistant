import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.business import Business


def update_business_context():
    db = SessionLocal()
    try:
        business = db.query(Business).filter(Business.id == 1).first()
        if not business:
            print("Negocio no encontrado")
            return
        
        business.ai_context = """Somos una clinica dental en Lima, Peru.

SERVICIOS Y PRECIOS:
- Limpieza dental: S/80
- Blanqueamiento: S/350
- Brackets (ortodoncia): S/2500
- Extraccion: S/150
- Revision general: S/50

HORARIO:
- Lunes a Viernes: 9:00 AM - 6:00 PM
- Sabados: 9:00 AM - 1:00 PM

UBICACION:
Av. Javier Prado 1234, San Isidro, Lima

CONTACTO:
- Telefono: (01) 234-5678
- Emergencias: 999-888-777

POLITICAS:
- Citas con 24h de anticipacion
- Cancelaciones gratis hasta 2h antes
- Aceptamos tarjeta y efectivo"""
        
        business.ai_enabled = True
        db.commit()
        print(f"Contexto de IA actualizado para: {business.name}")
        
    finally:
        db.close()


if __name__ == "__main__":
    update_business_context()