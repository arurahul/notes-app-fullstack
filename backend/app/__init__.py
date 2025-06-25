from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change in production!
    JWTManager(app)
    db.init_app(app)
    CORS(app)

    from app.routes import routes_bp
    app.register_blueprint(routes_bp)
    with app.app_context():
        db.create_all()

    return app