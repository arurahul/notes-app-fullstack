def create_tags(client):
    response=client.post("/tags", json={
        "name":"work"
    })
    assert response.status_code == 201
    assert response.get_json()["name"]=="work"