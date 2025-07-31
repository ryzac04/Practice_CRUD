from ..extensions import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__= 'users' # Specify the database table name explicitly. 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), # Timestamp column with timezone support
        default=lambda: datetime.now(timezone.utc)) # Default value is current UTC (Coordinated Universal Time) datetime (timezone-aware)

    def __repr__(self):
        # Defines string representation of User instances. Useful for debugging and logging. 
        return f"<User {self.username}>"