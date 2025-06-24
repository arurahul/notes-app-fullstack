# Realtime Notes App

Full-stack note-taking app using Flask (backend), React.js (frontend), SQLAlchemy, Redis, and Docker.

## Features
- JWT Auth
- Real-time sync (Socket.IO + Redis)
- Tag-based organization
- Markdown support

## How to Run
- `docker-compose up` to run both services

## 📘 API Quick Reference — Notes

### 🔹 Base URL
`http://localhost:5000`

---

### 📥 Create a Note  
**Method:** `POST`  
**Endpoint:** `/notes`  
**Request Body:**

    {
      "title": "My Note",
      "content": "This is a note."
    }

**Response:**

    {
      "message": "Note created"
    }

---

### 📤 Get All Notes  
**Method:** `GET`  
**Endpoint:** `/notes`  
**Response:**

    [
      {
        "id": 1,
        "title": "My Note",
        "content": "This is a note."
      }
    ]

---

### ✏️ Update a Note  
**Method:** `PUT`  
**Endpoint:** `/notes/<note_id>`  
**Request Body:**

    {
      "title": "Updated Title",
      "content": "Updated content"
    }

**Response:**

    {
      "message": "Note updated"
    }

---

### 🗑️ Delete a Note  
**Method:** `DELETE`  
**Endpoint:** `/notes/<note_id>`  
**Response:**

    {
      "message": "Note deleted"
    }