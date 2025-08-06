from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from datetime import timedelta

from ..models import User
from ..extensions import db, bcrypt
from ..schemas import UserSchema, UserLoginSchema
from ..utils import token_blacklist

from app.exceptions import InvalidUsage

# Create new blueprint called 'auth' and all routes here will be prefixed with '/api/auth'.
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Instantiate schemas.
user_schema = UserSchema()
login_schema = UserLoginSchema()

@auth_bp.route('/register', methods=['POST'])
def register(): 
    data = user_schema.load(request.json)
    
    if User.query.filter_by(username=data["username"]).first():
        raise InvalidUsage(
            "Username already exists.",
            status_code=409,
            payload={"field": "username"}
        )
    
    if User.query.filter_by(email=data["email"]).first():
        raise InvalidUsage(
            "Email already exists.",
            status_code=409,
            payload={"field": "email"}
        )
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    try:
        # Attempt to add the new_user object to the current database session
        db.session.add(new_user)

        # Try to commit (save) the session changes to the database
        db.session.commit()

    except Exception as err:
        # If *any* exception occurs during the add or commit operations...

        # Roll back the current database session to prevent partial writes or corruption
        db.session.rollback()

        # Log the error with details using Flask's built-in logger
        # This message will appear in the terminal (or log file if configured)
        current_app.logger.error(f"Database error during registration: {err}")

        # Raise a custom application error using your defined InvalidUsage exception
        # This sends a safe, generic error response to the client with a 500 status code
        raise InvalidUsage("Database error during registration.", 500)


        # Dumps the user object as JSON, omitting the password thanks to the schema. 
    return jsonify(user_schema.dump(new_user)), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # Validate login credentials. 
    data = login_schema.load(request.json)

    # Look up the user by username or email. 
    user = None
    if data.get('username'):
        user = User.query.filter_by(username=data['username']).first()
    elif data.get('email'):
        user = User.query.filter_by(email=data['email']).first() 

    # Check that user exists and password matches. 
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        raise InvalidUsage("Invalid credentials.", status_code=401)
    
    # Create JWT and send back. 
    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
    return jsonify(access_token=access_token), 200 

@auth_bp.route('/logout', methods=["POST"])
# Protects routes by requiring a valid JWT. It sends the request (typically as an Authorization: Bearer <token> header) and ensures it is valid, not expired, and not revoked (blacklist config). Sends 401 Unauthorized if not valid. 
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    token_blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200 