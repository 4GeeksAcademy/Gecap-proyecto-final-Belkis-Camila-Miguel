from src.app import app
from src.models import db
with app.app_context():
    db.drop_all()
    db.create_all()
    print("✅ Base de datos LIMPIA y tablas creadas con éxito")
