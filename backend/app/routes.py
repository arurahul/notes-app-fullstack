from flask import Blueprint, request, jsonify
from .models import Note,Tag,User
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
routes_bp = Blueprint('routes', __name__)


#Get All Notes
@routes_bp.route('/notes',methods=['GET'])
@jwt_required
def getAllNotes():
    user_id=get_jwt_identity()
    notes=Note.query.filter_by(user_id=user_id).all()
    return jsonify([note.to_dict() for note in notes])

#Create Notes
@routes_bp.route("/notes",methods=['POST'])
@jwt_required
def createNote():
    user_id=get_jwt_identity()
    data=request.get_json()
    new_note=Note(title=data["title"],content=data["content"],user_id=user_id)
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()),201

#Update Note
@routes_bp.route("/notes/<int:notes_id>",methods=['PUT'])
@jwt_required
def updateNotes(notes_id):
    user_id = get_jwt_identity()
    data=request.get_json()
    note=Note.query.filter_by(id=notes_id,user_id=user_id).first()
    if note:
        note.title=data["title"]
        note.content=data["content"]
        db.session.commit()
        return jsonify(note.to_dict()), 200
    return jsonify({"message":"Note Not Found"}),404

#Delete Note
@routes_bp.route("/notes/<int:notes_id>",methods=["DELETE"])
@jwt_required
def deleteNote(notes_id):
    user_id = get_jwt_identity()
    note=Note.query.filter_by(id=notes_id,user_id=user_id).first()
    if note:
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Note Deleted Successfully"}), 200
    return jsonify({"message": "Note Not Found"}), 404
