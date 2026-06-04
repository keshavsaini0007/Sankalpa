# Task Management API

A production-quality REST API built with Node.js, Express.js, and MongoDB.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd backend
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Install dependencies & run

```bash
npm install
npm run dev
```

The server starts at `http://localhost:8000`.

---

## API Reference

All task routes require `Authorization: Bearer <token>` header.

### User Routes — `/api/v1/users`

| Method | Route       | Auth | Description            |
| ------ | ----------- | ---- | ---------------------- |
| POST   | `/register` | No   | Register a new user    |
| POST   | `/login`    | No   | Login and get JWT token |

### Task Routes — `/api/v1/tasks`

| Method | Route             | Auth | Description            |
| ------ | ----------------- | ---- | ---------------------- |
| GET    | `/`               | Yes  | Get all user tasks     |
| POST   | `/`               | Yes  | Create a new task      |
| PATCH  | `/:taskId`        | Yes  | Update a task          |
| DELETE | `/:taskId`        | Yes  | Delete a task          |
| PATCH  | `/:taskId/toggle` | Yes  | Toggle task status     |

#### Query Parameters (GET /tasks)

| Param    | Type   | Description                                   |
| -------- | ------ | --------------------------------------------- |
| status   | string | Filter: `pending` or `completed`              |
| search   | string | Partial match on title/description (case-insensitive) |
| page     | number | Page number (default: 1)                      |
| limit    | number | Items per page (default: 10)                  |

---

## Sample Requests & Responses

### POST /api/v1/users/register

```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response (201)
{
  "statusCode": 201,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Registered successfully",
  "success": true
}
```

### POST /api/v1/users/login

```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200)
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Login successful",
  "success": true
}
```

### GET /api/v1/tasks

```
Authorization: Bearer <token>
```

```json
// Response (200)
{
  "statusCode": 200,
  "data": {
    "tasks": [
      {
        "_id": "664f1b3c4d5e6f7a8b9c0e1f",
        "title": "Complete project report",
        "description": "Finish the quarterly report",
        "status": "pending",
        "userId": "664f1a2b3c4d5e6f7a8b9c0d",
        "createdAt": "2025-01-15T10:00:00.000Z",
        "updatedAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
  },
  "message": "Tasks fetched successfully",
  "success": true
}
```

### POST /api/v1/tasks

```
Authorization: Bearer <token>
```

```json
// Request
{
  "title": "Complete project report",
  "description": "Finish the quarterly report"
}

// Response (201)
{
  "statusCode": 201,
  "data": {
    "_id": "664f1b3c4d5e6f7a8b9c0e1f",
    "title": "Complete project report",
    "description": "Finish the quarterly report",
    "status": "pending",
    "userId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Task created",
  "success": true
}
```

### PATCH /api/v1/tasks/:taskId

```
Authorization: Bearer <token>
```

```json
// Request
{
  "title": "Updated title",
  "status": "completed"
}

// Response (200)
{
  "statusCode": 200,
  "data": {
    "_id": "664f1b3c4d5e6f7a8b9c0e1f",
    "title": "Updated title",
    "description": "Finish the quarterly report",
    "status": "completed",
    "userId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  },
  "message": "Task updated",
  "success": true
}
```

### DELETE /api/v1/tasks/:taskId

```
Authorization: Bearer <token>
```

```json
// Response (200)
{
  "statusCode": 200,
  "data": {},
  "message": "Task deleted",
  "success": true
}
```

### PATCH /api/v1/tasks/:taskId/toggle

```
Authorization: Bearer <token>
```

```json
// Response (200)
{
  "statusCode": 200,
  "data": {
    "_id": "664f1b3c4d5e6f7a8b9c0e1f",
    "title": "Complete project report",
    "description": "Finish the quarterly report",
    "status": "completed",
    "userId": "664f1a2b3c4d5e6f7a8b9c0d",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  },
  "message": "Status toggled",
  "success": true
}
```
