"""Backend API tests for A2Z Plant Nutrient site."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://india-map-stats.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Health ----------
def test_health(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True


# ---------- Seed idempotency ----------
def test_seed_idempotent(s):
    r1 = s.post(f"{API}/seed")
    assert r1.status_code == 200
    r2 = s.post(f"{API}/seed")
    assert r2.status_code == 200
    # Second run should seed zero items
    seeded2 = r2.json().get("seeded", {})
    assert seeded2.get("blogs", 0) == 0
    assert seeded2.get("careers", 0) == 0
    assert seeded2.get("media", 0) == 0


# ---------- Careers ----------
def test_careers_list(s):
    r = s.get(f"{API}/careers")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 4


# ---------- Blogs CRUD ----------
def test_blogs_crud_and_filters(s):
    # list initial
    r = s.get(f"{API}/blogs")
    assert r.status_code == 200
    initial = r.json()
    assert isinstance(initial, list)
    assert len(initial) >= 3

    # create
    payload = {
        "title": "TEST_Blog Automated Entry",
        "excerpt": "test excerpt",
        "content": "test content body with unique keyword ZZTESTKW",
        "author": "Tester",
        "category": "TestCat",
        "tags": ["t1"],
        "cover_image": "",
    }
    r = s.post(f"{API}/blogs", json=payload)
    assert r.status_code == 200, r.text
    blog = r.json()
    assert blog["title"] == payload["title"]
    assert "automated-entry" in blog["slug"]
    blog_id = blog["id"]
    slug = blog["slug"]

    # get by slug
    r = s.get(f"{API}/blogs/{slug}")
    assert r.status_code == 200
    assert r.json()["id"] == blog_id

    # search by q
    r = s.get(f"{API}/blogs", params={"q": "ZZTESTKW"})
    assert r.status_code == 200
    results = r.json()
    assert any(b["id"] == blog_id for b in results)

    # filter by category
    r = s.get(f"{API}/blogs", params={"category": "TestCat"})
    assert r.status_code == 200
    assert any(b["id"] == blog_id for b in r.json())

    # update
    r = s.put(f"{API}/blogs/{blog_id}", json={**payload, "title": "TEST_Blog Automated Entry", "excerpt": "updated"})
    assert r.status_code == 200
    assert r.json()["excerpt"] == "updated"

    # verify persistence
    r = s.get(f"{API}/blogs/{slug}")
    assert r.json()["excerpt"] == "updated"

    # delete
    r = s.delete(f"{API}/blogs/{blog_id}")
    assert r.status_code == 200

    # 404 after delete
    r = s.get(f"{API}/blogs/{slug}")
    assert r.status_code == 404


# ---------- Media CRUD ----------
def test_media_crud(s):
    r = s.get(f"{API}/media")
    assert r.status_code == 200
    assert len(r.json()) >= 10

    # image via URL
    r = s.post(f"{API}/media", json={
        "title": "TEST_Media URL", "description": "d", "category": "Test",
        "media_type": "image", "data": "https://example.com/x.jpg"
    })
    assert r.status_code == 200
    mid = r.json()["id"]

    # video via base64-like
    r = s.post(f"{API}/media", json={
        "title": "TEST_Video base64", "description": "d", "category": "Test",
        "media_type": "video", "data": "data:video/mp4;base64,AAAA"
    })
    assert r.status_code == 200
    vid = r.json()["id"]

    # list
    r = s.get(f"{API}/media")
    ids = [m["id"] for m in r.json()]
    assert mid in ids and vid in ids

    # delete
    for x in (mid, vid):
        r = s.delete(f"{API}/media/{x}")
        assert r.status_code == 200


# ---------- Contact ----------
def test_profile_requests_create_and_list(s):
    payload = {
        "name": "TEST_ProfileUser",
        "organization": "TEST_ORG",
        "designation": "Manager",
        "email": "profile_test@example.com",
        "phone": "9998887777",
        "tender_ref": "TENDER-XYZ",
        "message": "Please send company profile."
    }
    r = s.post(f"{API}/profile-requests", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["organization"] == payload["organization"]
    assert data["email"] == payload["email"]
    assert "id" in data
    created_id = data["id"]

    r = s.get(f"{API}/profile-requests")
    assert r.status_code == 200
    lst = r.json()
    assert isinstance(lst, list)
    assert any(x["id"] == created_id for x in lst)


def test_contact_submit(s):
    r = s.post(f"{API}/contact", json={
        "name": "TEST_User", "email": "test@example.com", "phone": "9999999999",
        "subject": "Hello", "message": "test message"
    })
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
