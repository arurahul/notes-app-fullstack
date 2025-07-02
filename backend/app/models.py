from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
note_tags = db.Table('note_tags',
    db.Column('note_id', db.Integer, db.ForeignKey('note.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # 🔗 Many-to-Many relationship with Tag
    tags = db.relationship('Tag', secondary=note_tags, backref='notes', lazy='subquery')
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "tags": [tag.to_dict() for tag in self.tags],
            "pinned": self.pinned,
        }
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True,nullable=False)
    password = db.Column(db.String(128), nullable=False)
    # Optional: For debugging or relationships
    notes = db.relationship('Note', backref='user', lazy=True)
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }