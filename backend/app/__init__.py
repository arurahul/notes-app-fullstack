from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_caching import Cache
from flask_socketio import SocketIO
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os

db = SQLAlchemy()
cache = Cache()  # ✅ Now available to other modules
socketio = SocketIO()
migrate=Migrate()
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
    CORS(app,supports_credentials=True, origins=["http://localhost:3000"])
    socketio.init_app(app,cors_allowed_origins="*")
    migrate.init_app(app,db)
    from app.routes import routes_bp
    from app.tags import tags_bp
    app.register_blueprint(routes_bp)
    app.register_blueprint(tags_bp)

    # with app.app_context():
    #     db.create_all()
    from app import sockets 
    return app
