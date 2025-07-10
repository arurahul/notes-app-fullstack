
def test_create_note(client, auth_headers):
    res = client.post("/notes", json={
        "title": "Test Note",
        "content": "This is a test note.",
        "tags": ["test", "important"]
    }, headers=auth_headers)

    assert res.status_code == 201
    data = res.get_json()
    assert data["message"] == "Note created successfully"
    assert "note" in data
    assert data["note"]["title"] == "Test Note"
    
def test_get_notes(client, auth_headers):
    # Create a note first
    client.post("/notes", json={
        "title": "Note 1", "content": "Content 1", "tags": []
    }, headers=auth_headers)

    res = client.get("/notes", headers=auth_headers)
    assert res.status_code == 200
    notes = res.get_json()
    assert isinstance(notes, list)
    assert any(n["title"] == "Note 1" for n in notes)
    
def test_update_note(client, auth_headers):
    # First create a note
    res = client.post("/notes", json={
        "title": "Old Title", "content": "Old content", "tags": []
    }, headers=auth_headers)
    note_id = res.get_json()["note"]["id"]

    # Then update it
    res = client.put(f"/notes/{note_id}", json={
        "title": "Updated Title",
        "content": "Updated content"
    }, headers=auth_headers)

    assert res.status_code == 200
    updated = res.get_json()
    assert updated["note"]["title"] == "Updated Title"
    
def test_delete_note(client, auth_headers):
    res = client.post("/notes", json={
        "title": "Delete Me", "content": "Soon gone", "tags": []
    }, headers=auth_headers)
    note_id = res.get_json()["note"]["id"]

    res = client.delete(f"/notes/{note_id}", headers=auth_headers)
    assert res.status_code == 200
    assert res.get_json()["message"] == "Note deleted successfully"

    # Verify deletion
    res = client.get("/notes", headers=auth_headers)
    notes = res.get_json()
    assert all(note["id"] != note_id for note in notes)


def test_search_notes_found(client, auth_headers):
    # Create test notes
    client.post("/notes", json={"title": "Flask is great", "content": "Flask + React works well"}, headers=auth_headers)
    client.post("/notes", json={"title": "Learn Django", "content": "Another Python web framework"}, headers=auth_headers)

    # Search for keyword that exists
    res = client.get("/notes?search=flask", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert isinstance(data, list)
    assert any("flask" in note["title"].lower() or "flask" in note["content"].lower() for note in data)

def test_search_notes_not_found(client, auth_headers):
    # Search for a random non-matching keyword
    res = client.get("/notes?search=unicorn123", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert data == []

def test_search_notes_empty_keyword(client, auth_headers):
    # Should return all notes or raise an error, depending on your API logic
    res = client.get("/notes?search=", headers=auth_headers)
    assert res.status_code == 200  # or 400 if you require the keyword