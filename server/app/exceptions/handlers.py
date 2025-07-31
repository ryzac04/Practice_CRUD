from flask import jsonify
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException
from .api_exceptions import InvalidUsage

def register_error_handlers(app):

    # Handles custom application errors that the user defines and raises manually.
    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify({
            "error": error.to_dict(),
            "code": error.status_code
        })
        return response, error.status_code 

    # Handles input validation errors raised by Marshmallow schemas.
    # Triggered when .load() fails due to bad/missing input data. 
    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        return jsonify({
            "error": {
                "messages": err.messages,
                "code": 400
            }
        }), 400 
    
    # Handles standard HTTP exceptions raised by Flask/Wekzeug.
    # Examples: 404 Not Found, 405 Method Not Allowed, etc. 
    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        return jsonify({
            "error": {
                "message": err.description,
                "code": err.code
            }
        }), err.code 
    
    # Generic fallback for any other unhandled exception in the app.
    # Catches all Python exceptions not already caught above. 
    @app.errorhandler(Exception)
    def handle_unexpected_error(err):
        app.logger.error(f"Unexpected error: {err}")
        return jsonify({
            "error": {
                "message": "Internal server error",
                "code": 500
            }
        }), 500 