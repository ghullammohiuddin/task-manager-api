# Task Manager API

A secure and scalable RESTful API for managing tasks with user authentication and authorization. Built using Node.js, Express.js, and MySQL, this project demonstrates production-level backend practices including service layer architecture, centralized error handling, input validation, and dynamic SQL queries.

---

## Overview

This Task Manager API allows users to:

- Register and login securely with hashed passwords
- Create, read, update, and delete their own tasks
- Access only their own tasks (user-specific authorization)
- Filter tasks by status, sort by field, and paginate results
- Receive structured, consistent error responses

---

## Tech Stack

| Category       | Technology              |
|----------------|-------------------------|
| Backend        | Node.js, Express.js     |
| Database       | MySQL (mysql2/promise)  |
| Authentication | JWT (JSON Web Tokens)   |
| Validation     | Joi                     |
| Security       | bcrypt                  |
| Environment    | dotenv                  |
| Version Control| Git & GitHub            |

---

## Features

- User registration and login with bcrypt password hashing
- JWT-based authentication middleware protecting all task routes
- Full CRUD operations for tasks
- User-specific data access control
- Centralized error handling with custom AppError class
- Automatic JWT error handling (expired/invalid tokens)
- catchAsync wrapper eliminating try-catch from controllers
- Service layer separating business logic from controllers
- Joi request validation on all endpoints
- Pagination, status filtering, and sorting with SQL injection prevention
- Dynamic SQL queries for partial updates
- Clean MVC architecture with separate routes, controllers, services, validators

---

## Project Structure

```
src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── task.controller.js
│   └── user.controller.js
├── database/
│   └── db.connection.js
├── middlewares/
│   ├── auth.middleware.js
│   └── errorhandler.middleware.js
├── migrations/
│   ├── 001_create_user_table.sql
│   └── 002_create_task_table.sql
├── routes/
│   ├── auth.route.js
│   └── task.route.js
├── services/
│   ├── task.service.js
│   └── user.service.js
├── utils/
│   ├── AppError.js
│   └── catchAsync.js
└── validators/
    ├── auth.validator.js
    └── task.validator.js
```

---

## API Endpoints

### Authentication

| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| POST   | /api/auth/register  | Register a new user         |
| POST   | /api/auth/login     | Login and receive JWT token |

### Tasks (all protected — requires Bearer token)

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| POST   | /api/tasks/add-task             | Create a new task                  |
| GET    | /api/tasks/get-tasks            | Get all tasks (pagination/filters) |
| GET    | /api/tasks/get-task-by-id/:id   | Get a specific task by ID          |
| PATCH  | /api/tasks/update-task/:id      | Update a task (partial updates)    |
| DELETE | /api/tasks/delete-task/:id      | Delete a task                      |

---

## Query Parameters

Supported on `GET /api/tasks/get-tasks`:

| Parameter | Type   | Description                        | Default    |
|-----------|--------|------------------------------------|------------|
| page      | number | Page number                        | 1          |
| limit     | number | Tasks per page (max: 50)           | 10         |
| status    | string | Filter by status (pending/completed)| —         |
| sort      | string | Sort field (created_at/title)      | created_at |
| order     | string | Sort direction (asc/desc)          | desc       |

### Example Request

```
GET /api/tasks/get-tasks?page=1&limit=5&status=pending&sort=title&order=asc
```

### Example Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "totalPages": 2,
    "totalTasks": 8
  }
}
```

---

## Setup & Installation

### Clone the repository

```bash
git clone https://github.com/ghullammohiuddin/task-manager-api.git
cd task-manager-api
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the root directory:

```env
MY_SQL_URL=your_mysql_connection_url
JWT_SECRET=your_secret_key
PORT=3000
```

### Run migrations

Run these SQL files in your database in order:

```
src/migrations/001_create_user_table.sql
src/migrations/002_create_task_table.sql
```

### Start the server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Error Handling

All errors return consistent JSON responses:

```json
{
  "success": false,
  "status": "fail",
  "message": "Error description"
}
```

| Scenario             | Status | Message                              |
|----------------------|--------|--------------------------------------|
| No token             | 401    | No Token Provided                    |
| Invalid token        | 401    | Invalid token. Please log in again.  |
| Expired token        | 401    | Your token has expired.              |
| Task not found       | 404    | Task not found!                      |
| Validation error     | 400    | Detailed validation message          |
| Server error         | 500    | Something went wrong                 |

---

## Future Improvements

- Refresh token authentication
- Rate limiting
- Unit and integration tests
- Deployment (Railway, Render)
- TypeScript migration

---

## License

This project is licensed under the MIT License.

---

## Author

**Ghullam Mohiuddin**
Backend Developer (Node.js, Express.js, MySQL, JWT)

GitHub: https://github.com/ghullammohiuddin
LinkedIn: https://www.linkedin.com/in/ghullam-mohiuddin-0916bb377