# REST API Documentation

Base URL: `http://localhost:8000/api`

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account.
- **Request Body**:
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!"
}
```
- **Response**: `201 Created` with JWT `access_token` and user object.

### `POST /auth/login`
Authenticates existing credentials.
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```
- **Response**: `200 OK` with JWT `access_token` and user object.

### `GET /auth/me`
Retrieves current authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Task Management Endpoints

### `POST /tasks`
Creates a new task.
- **Request Body**:
```json
{
  "title": "Complete Deep Learning Project",
  "description": "Train PyTorch model and integrate with API",
  "category": "Development",
  "priority": "High",
  "deadline": "2026-09-20T18:00:00Z",
  "estimated_duration": 8.0,
  "subtasks": ["Prepare dataset", "Train model", "Run evaluation"]
}
```

### `GET /tasks`
Queries tasks with optional filters:
- Query Parameters: `category`, `priority`, `status`, `risk_level`, `search`.

### `GET /tasks/{id}`
Retrieves a specific task and its associated subtasks.

### `PUT /tasks/{id}`
Updates task attributes.

### `DELETE /tasks/{id}`
Permanently deletes a task.

### `PATCH /tasks/{id}/complete`
Toggles task completion state.

---

## 3. AI Assistance Endpoints

### `POST /ai/prioritize`
Predicts priority using the trained Deep Learning model.
- **Request Body**:
```json
{
  "title": "Fix critical database leak before tomorrow morning",
  "description": "Urgent blocker affecting production",
  "deadline": "2026-09-18T09:00:00Z",
  "estimated_duration": 3.0,
  "user_importance": "High"
}
```
- **Response**: Contains `predicted_priority`, `confidence_score`, `class_probabilities`, `detected_urgency`, `explanation`, and `breakdown` (model vs system vs user).

### `POST /ai/breakdown`
Decomposes complex goals into actionable subtasks.
- **Request Body**:
```json
{
  "title": "Build full stack task prioritizer app",
  "category": "Development"
}
```

### `POST /ai/deadline-risk`
Evaluates schedule delay risk.
- **Request Body**:
```json
{
  "title": "Write thesis chapter",
  "priority": "High",
  "deadline": "2026-09-18T12:00:00Z",
  "estimated_duration": 6.0,
  "progress": 10
}
```

---

## 4. Analytics Endpoints

### `GET /analytics/summary`
Returns task completion rates, counts, and category/priority/risk distributions.

### `GET /analytics/productivity`
Returns 7-day velocity history and subtask completion stats.
