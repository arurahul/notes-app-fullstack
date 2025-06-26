# Notes App

A full-stack Notes application built with Flask (backend), React (frontend), SQLAlchemy, Redis, and JWT authentication.

---

## Project Overview

This app allows users to:

- Register and login securely with JWT tokens
- Create, read, update, and delete notes
- Tag notes with multiple tags (many-to-many relationship)
- Search notes by keywords in title or content
- Filter notes by tags
- Paginate notes for efficient browsing

---

## Tech Stack

- **Backend:** Python, Flask, SQLAlchemy, Flask-JWT-Extended, Redis
- **Frontend:** React.js, Axios, Tailwind CSS (planned)
- **Database:** PostgreSQL / SQLite
- **Caching:** Redis
- **Authentication:** JWT tokens

---

## Setup Instructions

### Backend

1. Clone repo:
    ```bash
    git clone https://github.com/yourusername/notes-app.git
    cd notes-app
    ```

2. Create virtual environment and activate:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # macOS/Linux
    venv\Scripts\activate     # Windows
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Set environment variables (Linux/macOS):
    ```bash
    export FLASK_APP=app.py
    export FLASK_ENV=development
    export JWT_SECRET_KEY=your_secret_key
    ```

5. Initialize database:
    ```bash
    flask db upgrade  # If using migrations
    # or create tables manually
    python
    >>> from app import db
    >>> db.create_all()
    >>> exit()
    ```

6. Run the backend server:
    ```bash
    flask run
    ```

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| POST   | `/auth/register` | Register a new user   |
| POST   | `/auth/login`    | Login and get JWT     |

### Notes

| Method | Endpoint             | Description                         | Query Params               |
|--------|----------------------|-----------------------------------|----------------------------|
| GET    | `/notes`             | Get paginated notes for user       | `page`, `limit`, `q`, `tag` |
| POST   | `/notes`             | Create a new note                  |                            |
| GET    | `/notes/<note_id>`   | Get single note detail             |                            |
| PUT    | `/notes/<note_id>`   | Update a note                     |                            |
| DELETE | `/notes/<note_id>`   | Delete a note                     |                            |

- **Search & Filter:**
  - `q`: search keyword (title or content)
  - `tag`: filter notes by tag name
  - Example: `/notes?q=meeting&tag=work&page=1&limit=10`

### Tags

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/tags`            | Get all tags             |
| POST   | `/tags`            | Create a new tag         |
| PUT    | `/tags/<tag_id>`   | Update a tag             |
| DELETE | `/tags/<tag_id>`   | Delete a tag             |

---

## Models Summary

- **User**: id, username, password (hashed)
- **Note**: id, title, content, user_id, created_at, updated_at
- **Tag**: id, name
- **Association Table**: note_tag (note_id, tag_id) — many-to-many between notes and tags

---

## Usage Notes

- All `/notes` and `/tags` endpoints require an Authorization header with a valid JWT access token.
- Pagination defaults to 10 items per page.
- Search is case-insensitive.
- Tags filter matches exact tag names.

---

## What You Learned So Far

- Secure user authentication with JWT
- Database modeling with many-to-many relationships
- CRUD APIs with Flask and SQLAlchemy
- Query parameter handling for search, filter, and pagination
- Writing clean, maintainable backend code ready for production

---

## Next Steps

- Day 5: Integrate Redis caching to speed up note and tag retrieval
- Frontend React app setup with Tailwind CSS styling and token-based authentication flow
- Real-time syncing with WebSockets
- Adding user roles and permissions
- Writing tests and improving documentation

---

## License

MIT © ArvindRahul
