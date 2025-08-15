from flask import Flask, request
from .config import Config
from .extensions import db, cors, migrate, jwt, bcrypt
from .utils.token_blacklist import is_token_revoked
from app.exceptions import register_error_handlers
from app.routes import auth_bp, user_bp # import blueprint objects 

def create_app():
    app = Flask(__name__)

    # Load config from config.py.
    app.config.from_object(Config)

    # Initialize Flask extensions with app. 
    db.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": { # only match API routes
            "origins": "http://localhost:5173", # React dev server
            "supports_credentials": True
        }
    })
    migrate.init_app(app, db)
    jwt.init_app(app)
    # Registers a callback that determines whether a token is blacklisted. 
    jwt.token_in_blocklist_loader(is_token_revoked)
    bcrypt.init_app(app)

    # Register the app's error handlers 
    register_error_handlers(app) 

    # Set up the above initializations first before continuing past this point. After that, create and then initialize as you go. 
    # Registers the app's routes/blueprints. 
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)


    # This function runs before every request.
    # If the incoming request is an HTTP OPTIONS request (preflight check for CORS),
    # it returns an empty response with status code 200 to let the browser proceed.
    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            return "", 200

    return app 