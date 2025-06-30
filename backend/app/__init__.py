from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
cache = Cache()  # ✅ Now available to other modules

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change in production!
    
    # Optional Redis setup
    # app.config["CACHE_TYPE"] = "RedisCache"
    # app.config["CACHE_REDIS_URL"] = "redis://localhost:6379/0"

    db.init_app(app)
    cache.init_app(app)
    JWTManager(app)
    CORS(app)

    from app.routes import routes_bp
    from app.tags import tags_bp
    app.register_blueprint(routes_bp)
    app.register_blueprint(tags_bp)

    with app.app_context():
        db.create_all()

    return app
