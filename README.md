
# 📘 Notes App

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/github/license/arurahul/notes-app)
![Stack](https://img.shields.io/badge/stack-Flask%20%7C%20React%20%7C%20Redis-blue)

A full-stack, real-time Notes application built with **Flask (backend)**, **React (frontend)**, **Redis**, **SQLAlchemy**, and **JWT authentication**.

---

## 📸 Screenshots

| Notes List View | Note Modal |
|------------------|------------|
| ![Notes](./screenshots/notes-list.png) | ![Modal](./screenshots/note-modal.png) |

---

## 📌 Project Overview

This app allows users to:

- 🔐 Register and login securely using JWT
- 📝 Create, read, update, and delete notes
- 🏷️ Tag notes with multiple tags (many-to-many relationship)
- 🔍 Search notes by keywords in title or content
- 🎯 Filter notes by tags
- 📌 Pin/unpin important notes
- 📄 Paginate notes for efficient browsing
- 🔄 Receive real-time updates using WebSockets (Socket.IO)
- ⚡️ Enjoy a smooth UI experience with toasts, modals, loading spinners

---

## 🛠 Tech Stack

### Backend
- **Flask**, **Flask-SocketIO**
- **SQLAlchemy**, **Flask-Migrate**
- **JWT** with `Flask-JWT-Extended`
- **Redis** for caching & pub/sub
- **PostgreSQL / SQLite** (development)

### Frontend
- **React.js**, **Axios**, **React Router**
- **Tailwind CSS**
- **React Hot Toast**, **Headless UI**
- **Socket.IO-client**

## ⚙️ Setup Instructions

### 🔁 Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development
export JWT_SECRET_KEY=your_secret_key
export DATABASE_URL=sqlite:///notes.db
export REDIS_URL=redis://localhost:6379/0

# Initialize DB
flask db upgrade

# Run server
flask run
```

### 💻 Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | `/auth/register` | Register user      |
| POST   | `/auth/login`    | Login and get JWT  |

### 📝 Notes

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| GET    | `/notes`             | Paginated notes list   |
| POST   | `/notes`             | Create a new note      |
| GET    | `/notes/<id>`        | Get single note detail |
| PUT    | `/notes/<id>`        | Update a note          |
| DELETE | `/notes/<id>`        | Delete a note          |
| PUT    | `/notes/<id>/pin`    | Toggle pin/unpin       |

**Query Parameters for `/notes`:**

- `page`: page number
- `limit`: notes per page
- `q`: search keyword (title or content)
- `tag`: tag filter (exact match)

### 🏷️ Tags

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/tags`            | Get all tags       |
| POST   | `/tags`            | Create a tag       |
| PUT    | `/tags/<id>`       | Edit a tag         |
| DELETE | `/tags/<id>`       | Delete a tag       |

---

## 🧠 Models Summary

- **User**: `id`, `username`, `password`
- **Note**: `id`, `title`, `content`, `is_pinned`, `user_id`, timestamps
- **Tag**: `id`, `name`
- **note_tag**: join table for notes ↔ tags (many-to-many)

---

## 🚀 Real-Time Features

- Emit events for:
  - `note_created`
  - `note_updated`
  - `note_deleted`
  - `note_pinned`
- Auto-refresh notes list across tabs/users using Flask-SocketIO + Redis pub/sub

---

## 🧪 What You've Accomplished

### ✅ Day 1–4:
- Flask backend with auth, notes, tags routes
- SQLAlchemy models and JWT setup

### ✅ Day 5:
- Redis route caching for:
  - `GET /notes/<id>` – 60s
  - `GET /tags` – 5 min

### ✅ Day 6–8:
- React UI with login, register, create/edit modals
- Reusable components with toast feedback
- Real-time sync via Flask-SocketIO
- `useNoteSocket` hook

### ✅ Day 9:
- Search, filter, pagination on `/notes`
- Pinned notes support (UI + backend)

### ✅ Day 10:
- Full UI polish and cleanup
- Loading states, empty states
- Socket + pagination compatibility confirmed

---

## 📈 Roadmap

- ✅ Deploy on Render (backend) and Vercel (frontend)
- ✅ Add Redis + Socket support
- 🧪 Unit + integration tests
- 📎 Attachments (images, files)
- ✨ Dark mode
- 👥 Multi-user collab

---

## 🚀 Deployment

### Backend (Render)

- Create new Web Service
- Set `start command`: `gunicorn -b 0.0.0.0:10000 app:app`
- Environment vars:
  - `FLASK_APP=app.py`
  - `JWT_SECRET_KEY=...`
  - `REDIS_URL=...`

### Frontend (Vercel)

- Output folder: `dist` or `build`
- Set environment variable: `VITE_API_BASE_URL=https://<your-api>`

---

## 🔒 License

MIT © [ArvindRahul]
