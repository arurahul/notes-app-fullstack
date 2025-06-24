from flask import Blueprint, request, jsonify
from .models import Note
from . import db
routes_bp = Blueprint('routes', __name__)


#Get All Notes
@routes_bp.route('/notes',methods=['GET'])
def getAllNotes():
    notes=Note.query.all()
    return jsonify([{
        "id":n.id,
        "title":n.title,
        "content":n.content
            } for n in notes])

#Create Notes
@routes_bp.route("/notes",methods=['POST'])
def createNote():
    data=request.get_json()
    new_note=Note(title=data["title"],content=data["content"])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message":"Note Created Successfully"}),201

#Update Note
@routes_bp.route("/notes/<int:notes_id>",methods=['PUT'])
def updateNotes(notes_id):
    data=request.get_json()
    note=Note.query.all(notes_id)
    if note:
        note.title=data["title"]
        note.content=data["content"]
        db.session.commit()
        return jsonify({"message":"Note Updated Successfully"}),200
    return jsonify({"message":"Note Not Found"}),404

#Delete Note
@routes_bp.route("/notes/<int:notes_id>",methods=["DELETE"])
def deleteNote(notes_id):
    note = Note.query.get(notes_id)
    if note:
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Note Deleted Successfully"}), 200
    return jsonify({"message": "Note Not Found"}), 404
