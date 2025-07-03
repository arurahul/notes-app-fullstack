from flask import Blueprint, request, jsonify
from .models import Note,Tag,User
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from . import db
from math import ceil
from sqlalchemy import or_
from app import cache,socketio
from flask import current_app
import traceback
routes_bp = Blueprint('routes', __name__)


@routes_bp.route('/notes', methods=['GET'], endpoint='allNotes')
@jwt_required()
def getAllNotes():
    try:
        user_id = get_jwt_identity()

        page = request.args.get('page', 1, type=int)
        limit = request.args.get('per_page', 6, type=int)
        search_query = request.args.get('search', '', type=str).lower()
        tag_name = request.args.get('tag', '', type=str)

        notes_query = Note.query.filter_by(user_id=int(user_id)).order_by(Note.created_at.desc())

        if search_query:
            notes_query = notes_query.filter(
                or_(
                    Note.title.ilike(f"%{search_query}%"),
                    Note.content.ilike(f"%{search_query}%")
                )
            )

        if tag_name:
            notes_query = notes_query.join(Note.tags).filter(Tag.name == tag_name)

        paginated_notes = notes_query.paginate(page=page, per_page=limit, error_out=False)

        notes = [note.to_dict() for note in paginated_notes.items]

        return jsonify({
            "notes": notes,
            "page": page,
            "per_page": limit,
            "total_pages": paginated_notes.pages,
            "total_items": paginated_notes.total
        }), 200

    except Exception as e:
        current_app.logger.error("Error in getAllNotes: %s", e)
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error"}), 500

#Get single note
@routes_bp.route('/notes/<int:note_id>', methods=['GET'], endpoint='get_note')
@jwt_required()
@cache.cached(timeout=60)
def get_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=int(user_id)).first()

    if not note:
        return jsonify({"error": "Note not found"}), 404

    return jsonify({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "tags": [tag.name for tag in note.tags],
        "created_at": note.created_at.isoformat()
    })
    
#Create Notes
@routes_bp.route("/notes",methods=['POST'], endpoint='create_note')
@jwt_required()
def createNote():
    user_id=get_jwt_identity()
    data=request.get_json()
    new_note=Note(title=data["title"],content=data["content"],user_id=int(user_id))
    db.session.add(new_note)
    db.session.commit()
    socketio.emit("note_created", new_note.to_dict())
    return jsonify(new_note.to_dict()),201

#Update Note
@routes_bp.route("/notes/<int:notes_id>",methods=['PUT'], endpoint='update_note')
@jwt_required()
def updateNotes(notes_id):
    user_id = get_jwt_identity()
    data=request.get_json()
    note=Note.query.filter_by(id=notes_id,user_id=int(user_id)).first()
    if note:
        note.title=data["title"]
        note.content=data["content"]
        note.pinned=data.get("pinned",note.pinned)
        db.session.commit()
        socketio.emit("note_updated", note.to_dict())
        return jsonify({"note":note.to_dict()}), 200
    return jsonify({"message":"Note Not Found"}),404

#Delete Note
@routes_bp.route("/notes/<int:notes_id>",methods=["DELETE"], endpoint='delete_note')
@jwt_required()
def deleteNote(notes_id):
    user_id = get_jwt_identity()
    note=Note.query.filter_by(id=notes_id,user_id=int(user_id)).first()
    if note:
        db.session.delete(note)
        db.session.commit()
        # Emit note ID only since it's deleted
        socketio.emit("note_deleted", {"id": note.id})
        return jsonify({"message": "Note Deleted Successfully"}), 200
    return jsonify({"message": "Note Not Found"}), 404

#Register User
@routes_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(data["password"])
    new_user = User(email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

#Login user
@routes_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token}), 200
