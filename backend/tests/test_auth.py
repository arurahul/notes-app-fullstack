def test_register(client):
    response = client.post("/register", json={
        "email": "test@example.com",
        "password": "secure123"
    })
    assert response.status_code == 201
    assert response.get_json()["message"] == "User registered successfully"
def test_invalid_register(client):
    response=client.post("/login",json={"email":"","password":"secure123"})
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid email or password"
    
def test_login(client):
    response=client.post("/login",json={"email":"test@example.com","password":"secure123"})
    assert response.status_code == 200
    data=response.get_json()
    assert "access_token" in data
    
def test_invalid_login(client):
    response=client.post("/login",json={"email":"test@exae.com","password":"secure123"})
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid email or password"