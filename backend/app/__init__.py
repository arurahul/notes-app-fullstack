from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .routes import main
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///notes.db')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret123')

    db.init_app(app)
    app.register_blueprint(main)

    return app
