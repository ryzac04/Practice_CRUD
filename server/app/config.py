import os
from dotenv import load_dotenv

# Load environment variables from .env file automatically.
load_dotenv()

class Config:
    #Set environment mode, defaulting to 'production' if not specified.
    FLASK_ENV = os.getenv("FLASK_ENV", "production")

    # Flask secret key - for securely signing cookies, sessions, CSRF, etc. Defaults to 'fallback-secret-key' if not specified. Not safe - do not do this in production! 
    FLASK_KEY = os.getenv("FLASK_SECRET_KEY", "fallback-flask-key")

    # SQLAlchemy database URI.
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    # Turn off event system to save resources.
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-key")

    # Enables token revocation in Flask-JWT-Extended.
    JWT_BLACKLIST_ENABLED = True

    # Tells Flask-JWT-Extended to check access tokens against the blacklist (not refresh tokens).
    JWT_BLACKLIST_TOKEN_CHECKS = ["access"]