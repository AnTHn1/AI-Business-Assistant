import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash


def create_admin_user():
    db = SessionLocal()
    try:
        admin_email = "admin@aibusiness.com"
        
        existing = db.query(User).filter(User.email == admin_email).first()
        if existing:
            print(f"Usuario {admin_email} ya existe.")
            return
        
        admin = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            is_active=True,
            is_superuser=True
        )
        
        db.add(admin)
        db.commit()
        print(f"Usuario admin creado: {admin_email} / admin123")
        
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()