from flask import Blueprint, request, jsonify
from models import db, Tag, Note

tags_bp = Blueprint('tags', __name__)

# Create a tag
@tags_bp.route('/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Tag name is required'}), 400

    if Tag.query.filter_by(name=name).first():
        return jsonify({'error': 'Tag already exists'}), 400

    tag = Tag(name=name)
    db.session.add(tag)
    db.session.commit()
    return jsonify(tag.to_dict()), 201

# Get all tags
@tags_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    return jsonify([tag.to_dict() for tag in tags]), 200

@tags_bp.route('/notes/<int:note_id>/tags', methods=['POST'])
def attach_tags_to_note(note_id):
    data = request.get_json()
    tag_ids = data.get('tag_ids', [])

    note = Note.query.get(note_id)
    if not note:
        return jsonify({'error': 'Note not found'}), 404

    for tag_id in tag_ids:
        tag = Tag.query.get(tag_id)
        if tag and tag not in note.tags:
            note.tags.append(tag)

    db.session.commit()
    return jsonify(note.to_dict()), 200

# Remove a tag from a note
@tags_bp.route('/notes/<int:note_id>/tags/<int:tag_id>', methods=['DELETE'])
def remove_tag_from_note(note_id, tag_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({'error': 'Note not found'}), 404

    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({'error': 'Tag not found'}), 404

    if tag in note.tags:
        note.tags.remove(tag)
        db.session.commit()

    return jsonify(note.to_dict()), 200