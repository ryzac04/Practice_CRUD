from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models import User
from ..extensions import db 
from ..schemas import UserSchema

from app.exceptions import InvalidUsage

user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# Instantiate schemas.
user_schema = UserSchema()

# Get a specific user's profile
@user_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_user(id):
    current_user_id = get_jwt_identity()
    if current_user_id != id:
        raise InvalidUsage("Unauthorized access", 403)

    user = User.query.get(id)
    if not user:
        raise InvalidUsage("User not found", 404)

    return jsonify(user_schema.dump(user)), 200


# Get all users (could be admin-only if extended)
@user_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    try:
        users = User.query.all()
        return jsonify(user_schema.dump(users)), 200
    except Exception as err:
        current_app.logger.error(f"Error retrieving users: {err}")
        raise InvalidUsage("Could not retrieve users", 500)


# Update a specific user's profile
@user_bp.route("/<int:id>", methods=["PATCH"])
@jwt_required()
def update_user(id):
    current_user_id = get_jwt_identity()
    if current_user_id != id:
        raise InvalidUsage("Unauthorized update attempt", 403)

    user = User.query.get(id)
    if not user:
        raise InvalidUsage("User not found", 404)

    try:
        data = user_schema.load(request.json, partial=True)

        for field, value in data.items():
            setattr(user, field, value)

        db.session.commit()
        return jsonify(user_schema.dump(user)), 200

    except Exception as err:
        db.session.rollback()
        current_app.logger.error(f"Error updating user {id}: {err}")
        raise InvalidUsage("Error updating user", 500)


# Delete a specific user's account
@user_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    current_user_id = get_jwt_identity()
    if current_user_id != id:
        raise InvalidUsage("Unauthorized delete attempt", 403)

    user = User.query.get(id)
    if not user:
        raise InvalidUsage("User not found", 404)

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify(message="User deleted"), 200

    except Exception as err:
        db.session.rollback()
        current_app.logger.error(f"Error deleting user {id}: {err}")
        raise InvalidUsage("Error deleting user", 500)
