from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors, bcrypt
from .utils.token_blacklist import is_token_revoked
from app.exceptions import register_error_handlers
from app.routes import auth_bp, user_bp # import blueprint objects 

def create_app():
    app = Flask(__name__)

    # Load config from config.py.
    app.config.from_object(Config)

    # Initialize Flask extensions with app. 
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # Registers a callback that determines whether a token is blacklisted. 
    jwt.token_in_blocklist_loader(is_token_revoked)
    bcrypt.init_app(app)
    cors(app)


    # Register the app's error handlers 
    register_error_handlers(app) 

    # Set up the above initializations first before continuing past this point. After that, create and then initialize as you go. 
    # Registers the app's routes/blueprints. 
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    return app 
