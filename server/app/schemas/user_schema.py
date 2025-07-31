from marshmallow import Schema, fields, ValidationError, validates_schema, validate, EXCLUDE
import re

# Custom validator for password complexity.
def validate_password_complexity(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$'
    if not re.match(pattern, password):
        raise ValidationError(
            "Password must be at least 8 characters long and include at least one lowercase character, one uppercase character, one number, and one special character."
        )

# Full User schema (used for general user serialization and creation).
class UserSchema(Schema):
    # Meta class inside a Marshmallow schema is an optional configuration block.
    class Meta:
        unknown = EXCLUDE # Ignore unknown fields during deserialization
        # ordered = True # Keep field order in the output JSON

    id = fields.Int(dump_only=True) # Only included when serializing to JSON. Sent in responses, not needed in requests. 
    username = fields.Str(required=False, validate=validate.Length(min=3, max=80)) # Required string field, must be 3 - 80 characters.
    email = fields.Email(required=False, validate=validate.Length(max=120)) # Required and must be a valid email format. 
    password = fields.Str(
        load_only=True, # Allowed in requests, not returned in responses. 
        required=True, 
        validate=[validate.Length(min=6), validate_password_complexity]
        ) 
    created_at = fields.DateTime(dump_only=True) # Read-only timestamp, included when serializing to JSON. Sent in responses, not needed in requests. 

# Schema for login - username or email and password only.
class UserLoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(
        load_only=True,
        required=True,
        validate=[validate.Length(min=8), validate_password_complexity]
    )

    # Marshmallow decorator - runs after all individual field validations. Used to validate relationships between fields and/or enforce rules that span multiple fields. 
    @validates_schema
    def require_email_or_username(self, data, **kwargs): # **kwargs is commonly used to pass a variable number of named arguments into a function (that the function may not explicitly define) so the function doesn't break if Marshmallow includes any extra arguments. 
        if not data.get("username") and not data.get("email"):
            raise ValidationError("Either 'email' or 'username' must be provided.")
