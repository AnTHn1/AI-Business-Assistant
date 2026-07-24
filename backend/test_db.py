import sys
import os

# Forzar UTF-8 en Windows
sys.stdout.reconfigure(encoding='utf-8')

from app.config import settings

print(f"DATABASE_URL cargada: {settings.DATABASE_URL}")

try:
    from app.database import engine
    from sqlalchemy import text
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print(f"✅ Conexion exitosa. Resultado: {result.scalar()}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()