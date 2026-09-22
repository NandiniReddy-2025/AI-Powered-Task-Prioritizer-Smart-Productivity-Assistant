import os
import sys
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.session import Base, get_db

# Use in-memory SQLite database for fast, isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers(client):
    # Register user
    reg_resp = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@productivity.ai",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!"
        }
    )
    assert reg_resp.status_code == 201
    token = reg_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_auth_registration_and_login(client):
    # Register
    reg_resp = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jane Doe",
            "email": "jane@example.com",
            "password": "password123",
            "confirm_password": "password123"
        }
    )
    assert reg_resp.status_code == 201
    assert "access_token" in reg_resp.json()
    assert reg_resp.json()["user"]["email"] == "jane@example.com"

    # Login
    login_resp = client.post(
        "/api/auth/login",
        json={
            "email": "jane@example.com",
            "password": "password123"
        }
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

def test_task_lifecycle_and_subtasks(client, auth_headers):
    # 1. Create Task
    create_resp = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "Complete Project Documentation",
            "description": "Write architecture and ML specs",
            "category": "Development",
            "priority": "High",
            "estimated_duration": 4.0,
            "subtasks": ["Draft Architecture", "Draft API specs"]
        }
    )
    assert create_resp.status_code == 201
    task = create_resp.json()
    assert task["title"] == "Complete Project Documentation"
    assert len(task["subtasks"]) == 2
    assert task["progress"] == 0
    assert task["completion_status"] == "Pending"
    task_id = task["id"]

    # 2. Complete first subtask
    subtask_1_id = task["subtasks"][0]["id"]
    sub_patch_resp = client.patch(
        f"/api/tasks/{task_id}/subtasks/{subtask_1_id}",
        headers=auth_headers,
        json={"is_completed": True}
    )
    assert sub_patch_resp.status_code == 200
    assert sub_patch_resp.json()["is_completed"] is True

    # 3. Check updated task progress (1 of 2 done = 50% In Progress)
    get_resp = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    updated_task = get_resp.json()
    assert updated_task["progress"] == 50
    assert updated_task["completion_status"] == "In Progress"

    # 4. Toggle complete task
    toggle_resp = client.patch(f"/api/tasks/{task_id}/complete", headers=auth_headers)
    assert toggle_resp.status_code == 200
    assert toggle_resp.json()["completion_status"] == "Completed"
    assert toggle_resp.json()["progress"] == 100

def test_ai_prioritize_api(client, auth_headers):
    ai_resp = client.post(
        "/api/ai/prioritize",
        headers=auth_headers,
        json={
            "title": "Fix critical production database leak",
            "description": "Urgent hotfix required asap",
            "estimated_duration": 2.0,
            "user_importance": "High"
        }
    )
    assert ai_resp.status_code == 200
    data = ai_resp.json()
    assert "predicted_priority" in data
    assert "confidence_score" in data
    assert "breakdown" in data
    assert "model_predicted" in data["breakdown"]

def test_analytics_endpoints(client, auth_headers):
    # Add a task
    client.post(
        "/api/tasks",
        headers=auth_headers,
        json={"title": "Test Task", "priority": "Medium", "estimated_duration": 1.0}
    )

    summary_resp = client.get("/api/analytics/summary", headers=auth_headers)
    assert summary_resp.status_code == 200
    assert summary_resp.json()["total_tasks"] >= 1

    prod_resp = client.get("/api/analytics/productivity", headers=auth_headers)
    assert prod_resp.status_code == 200
    assert len(prod_resp.json()["weekly_history"]) == 7
