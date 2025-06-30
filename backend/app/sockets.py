from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from flask import request
from app import socketio

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@socketio.on('join')
def handle_join(data):
    token = data.get('token')
    if token:
        decoded = decode_token(token)
        user_id = decoded['sub']
        join_room(user_id)
        print(f"User {user_id} joined their room.")

@socketio.on('leave')
def handle_leave(data):
    token = data.get('token')
    if token:
        decoded = decode_token(token)
        user_id = decoded['sub']
        leave_room(user_id)
        print(f"User {user_id} left their room.")