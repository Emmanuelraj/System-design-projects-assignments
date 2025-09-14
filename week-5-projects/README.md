Here’s a **README.md** draft for your backend projects:

````markdown
# Backend Projects

This repository contains two backend projects built with **Node.js** and **TypeScript**, demonstrating both **NoSQL** and **SQL** database integrations, along with authentication, authorization, and deployment practices.  

---

## 📚 Projects

### 1. Course Selling Application (Backend)
- **Features**
  - User Signup & Login
  - JWT-based Authentication & Authorization
- **Tech Stack**
  - Node.js, TypeScript
  - MongoDB Atlas (NoSQL, schemaless)
  - Mongoose (ODM)

---

### 2. Medium Blog Backend
- **Features**
  - User Signup & Login
  - JWT-based Authentication
- **Tech Stack**
  - Node.js, TypeScript
  - SQL Database
  - Prisma (ORM)

---

## 🐳 Docker
- Each project will include a **Dockerfile**.
- Docker images can be built to containerize the applications.
- Deployment-ready once integrated with Docker.

---

## ☁️ Deployment (AWS EC2)
- Plan to deploy both backends on **AWS EC2**.
- Steps will include:
  1. Launching an EC2 instance
  2. Installing Node.js & Docker
  3. Running the application container(s)
  4. Configuring security groups for access

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- TypeScript
- MongoDB Atlas (for Course Selling App)
- SQL Database (for Medium Blog Backend)
- Docker (for containerization)
- AWS account (for deployment)

### Installation
Clone the repository:
```bash
git clone https://github.com/your-username/backend-projects.git
cd backend-projects
````

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build and run in production:

```bash
npm run build
npm start
```

---

## 📌 Roadmap

* [x] Implement authentication (JWT)
* [x] Add database schemas/models
* [ ] Write Dockerfiles
* [ ] Deploy on AWS EC2

