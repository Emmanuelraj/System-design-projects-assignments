Here’s a solid draft for your **README.md** that explains the project clearly, including setup, features, and Postman testing examples. I’ll also answer your question about whether to start with backend or frontend.

---

# Personal Task Manager

A full-stack application that allows users to manage their personal to-do items. Each user can sign up, log in, and perform CRUD (Create, Read, Update, Delete) operations on their own private tasks. Authentication and authorization are implemented using JWT to ensure user privacy.

---

## Features

### 🔐 Authentication

* User signup and login with JWT token generation.
* Protected routes accessible only with a valid JWT.

### 📝 Task Management (CRUD)

* **Create**: Add new tasks.
* **Read**: View all tasks belonging to the logged-in user.
* **Update**: Edit an existing task.
* **Delete**: Remove a task.

### 🖥️ Tech Stack

* **Frontend**: React (with forms for authentication and task management).
* **Backend**: Node.js, Express, Prisma ORM.
* **Database**: PostgreSQL (or any relational DB supported by Prisma).
* **Auth**: JWT for secure authentication.

---

## Project Structure

```
personal-task-manager/
│
├── backend/         # Node.js + Express + Prisma
│   ├── prisma/      # Prisma schema and migrations
│   ├── routes/      # API routes (auth, tasks)
│   └── middleware/  # JWT verification middleware
│
├── frontend/        # React app
│   ├── src/
│   └── public/
│
└── README.md
```

---

## Database Models (Prisma Schema)

* **User**: Stores user information (id, email, password hash).
* **Task**: Stores task details (id, title, description, status, userId).

Relation: Each `Task` belongs to one `User`.

---

## API Endpoints

### Auth

* **POST** `/api/tasks/auth/signup` → Register a new user.
* **POST** `/api/tasks/auth/login` → Authenticate and receive a JWT.

### Tasks (Protected)

* **GET** `/api/tasks/` → Fetch all tasks for logged-in user.
* **POST** `/api/tasks/` → Create a new task.
* =============================Need to implement ================================ *
* **PUT** `/api/tasks/:id` → delete particular task for logged in user.
* **DELETE** `/api/tasks/:id` → update particular task for logged in user.


---

## Postman Testing

Below are sample requests & expected responses for testing with Postman.

### 1. Signup

**POST** `/signup`

```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

**Expected Response**

```json
{
  "message": "User created successfully"
}
```

---

### 2. Login

**POST** `/login`

```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

**Expected Response**

```json
{
  "token": "jwt.token.here"
}
```

---

### 3. Create Task

**POST** `/api/tasks` (with JWT in Authorization header: `Bearer <token>`)

```json
{
  "title": "Finish project",
  "description": "Complete the backend setup",
  "status": "pending"
}
```

**Expected Response**

```json
{
  "id": 1,
  "title": "Finish project",
  "description": "Complete the backend setup",
  "status": "pending",
  "userId": 1
}
```

---

### 4. Get Tasks

**GET** `/api/tasks` (with JWT)

**Expected Response**

```json
[
  {
    "id": 1,
    "title": "Finish project",
    "description": "Complete the backend setup",
    "status": "pending",
    "userId": 1
  }
]
```

---

### 5. Update Task

**PUT** `/api/tasks/1` (with JWT)

```json
{
  "status": "completed"
}
```

**Expected Response**

```json
{
  "id": 1,
  "title": "Finish project",
  "description": "Complete the backend setup",
  "status": "completed",
  "userId": 1
}
```

---

### 6. Delete Task

**DELETE** `/api/tasks/1` (with JWT)

**Expected Response**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Development Workflow

👉 **Which to start first?**

* **Backend first**: Recommended.

  * You’ll need working APIs (auth + CRUD) before connecting your frontend.
  * Test APIs using Postman to ensure authentication and data logic are correct.
* Once backend is stable, build the **Frontend** and connect to the API.

---

✅ This README.md outlines the **project goal, features, API, and testing strategy** so you (or teammates) can implement smoothly.
