def test_register(client):
    response = client.post("/register", json={
        "email": "test@example.com",
        "password": "secure123"
    })
    assert response.status_code == 201
    assert response.get_json()["message"] == "User registered successfully"