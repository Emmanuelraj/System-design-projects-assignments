# Authentication System (Express + TypeScript + JWT + Bcrypt)

This project demonstrates a simple **authentication system** built using **Express.js**, **TypeScript**, **JWT**, and **Bcrypt**.  
Currently, it uses an **in-memory datastore** (array) for users. Later, it can be extended to use **databases** like MongoDB or PostgreSQL with Prisma.

---

## Features
- User **signup** with password hashing (Bcrypt + salt rounds).
- User **login** with JWT token generation.
- Middleware-based **authentication** (`isAuthenticated`) and **login check** (`userExists`).
- In-memory datastore (can be replaced with DB later).
- Clean separation of concerns:
  - `auth.interface.ts` → User interface
  - `authMiddleware.ts` → Middleware class
  - `auth.ts` → Routes & server setup

---

## Tech Stack
- **Node.js** + **Express.js**
- **TypeScript**
- **Bcrypt** → For password hashing
- **JWT (jsonwebtoken)** → For authentication tokens
- **Dotenv** → For environment variables

---

## API Endpoints

### 1. Signup
`POST /signup`  
Registers a new user with a hashed password.

**Request body:**
```json
{
  "username": "testuser",
  "password": "secret123"
}
Response:

json
Copy
Edit
{
  "message": "User created successfully",
  "user": {
    "username": "testuser",
    "password": "<hashed_password>"
  }
}
2. Login
POST /login
Checks username & password, generates a JWT if valid.

Request body:

json
Copy
Edit
{
  "username": "testuser",
  "password": "secret123"
}
Response:

json
Copy
Edit
{
  "message": "Login successful",
  "token": "<jwt_token>"
}
3. Protected Route (Users)
POST /users
Accessible only with a valid JWT in Authorization header.

Headers:

makefile
Copy
Edit
Authorization: Bearer <jwt_token>
Response (200 OK):

json
Copy
Edit
{
  "msg": "you successfully loggedIn"
}
Response (Unauthorized):

json
Copy
Edit
{
  "message": "Unauthorized user please login again"
}
Project Structure
csharp
Copy
Edit
.
├── auth.interface.ts   # User interface
├── authMiddleware.ts   # Middleware for auth
├── auth.ts             # Main server (Express routes)
├── package.json
└── README.md
How to Run
Install dependencies:

bash
Copy
Edit
npm install
Set environment variables in .env:

ini
Copy
Edit
PORT=2500
JWT_SECRET=your_secret_key
Start the server:

bash
Copy
Edit
npm run dev
Test APIs in Postman.