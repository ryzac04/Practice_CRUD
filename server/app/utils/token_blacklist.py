token_blacklist = set()

def is_token_revoked(jwt_header, jwt_payload):
    # jti is JWT ID - this is automatically included in every JWT created by Flask-JWT-Extended. Can use this to track and revoke individual tokens. 
    jti = jwt_payload["jti"]
    return jti in token_blacklist