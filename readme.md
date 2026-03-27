# Task Manager API 

A secure and scalable RESTful API for managing tasks with user authentication and authorization. Built using Node.js, Express.js, and MySQL, this project demonstrates full CRUD operations, user-based access control, and production-level features like pagination.

---

##  Overview

This Task Manager API allows users to:

- Register and login securely  
- Create, read, update, and delete tasks  
- Access only their own tasks (authorization)  
- Retrieve tasks efficiently using pagination  
- Receive structured responses with proper error handling  

This project reflects real-world backend practices and is suitable for internships and production-ready API design.

---

##  Tech Stack

| Category         | Technology                |
|----------------|--------------------------|
| Backend         | Node.js, Express.js      |
| Database        | MySQL (mysql2/promise)   |
| Authentication  | JWT (JSON Web Tokens)    |
| Environment     | dotenv                   |
| Version Control | Git & GitHub             |

---

##  Features

- User registration and login with hashed passwords  
- JWT-based authentication middleware  
- Full CRUD operations for tasks  
- User-specific access control (authorization)  
- Pagination support for task listing  
- Input validation and error handling  
- Dynamic SQL queries for partial updates  
- Clean and modular project structure  

---

##  API Endpoints

###  Authentication

| Method | Endpoint             | Description                  |
|--------|---------------------|------------------------------|
| POST   | /api/auth/register  | Register a new user          |
| POST   | /api/auth/login     | Login and receive JWT token  |

---

###  Tasks

| Method | Endpoint          | Description                                   |
|--------|------------------|-----------------------------------------------|
| POST   | /api/tasks       | Create a new task                             |
| GET    | /api/tasks       | Get all tasks (supports pagination)           |
| GET    | /api/tasks/:id   | Get a specific task by ID                     |
| PUT    | /api/tasks/:id   | Update a task (partial updates supported)     |
| DELETE | /api/tasks/:id   | Delete a task                                 |

---

##  Query Parameters

Pagination is supported on:

GET /api/tasks/get-tasks

| Parameter | Type   | Description                          | Default |
|----------|--------|--------------------------------------|--------|
| page     | number | Page number                          | 1      |
| limit    | number | Tasks per page (max: 50)             | 10     |

### Example Request

GET /api/tasks/get-tasks?page=2&limit=5

### Example Response

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 2,
    "limit": 5,
    "totalPages": 4,
    "totalTasks": 20
  }
}

---

##  Setup & Installation

### Clone the repository

git clone https://github.com/ghullammohiuddin/task-manager-api.git 
cd task-manager-api  

### Install dependencies

npm install  

### Configure environment variables

Create a `.env` file in the root directory:

DB_HOST=your_db_host  
DB_USER=your_db_user  
DB_PASSWORD=your_db_password  
DB_NAME=your_db_name  
JWT_SECRET=your_secret_key  
PORT=3000  

### Run the server

npm start  

Server will run at:  
http://localhost:3000  

---

##  Key Learnings

- Built secure authentication using JWT  
- Implemented authorization with user-based data access  
- Designed RESTful APIs with proper structure and status codes  
- Implemented pagination using SQL LIMIT and OFFSET  
- Used dynamic SQL queries for flexible updates  
- Organized backend into scalable architecture  

---

##  Future Improvements

- Filtering tasks by status (pending, completed)  
- Sorting support (by date, title)  
- Refresh token authentication  
- Deployment (Railway, Render)  
- Unit and integration testing  

---

##  License

This project is licensed under the MIT License.

---

##  Author

Ghullam Mohiuddin
Backend Developer (Node.js, SQL, JWT, Express.JS)

GitHub: https://github.com/ghullammohiuddin 
LinkedIn: https://www.linkedin.com/in/yourprofile  