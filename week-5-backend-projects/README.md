# Backend Projects

This repository contains two backend projects implemented with **Node.js** and **TypeScript**.  
They demonstrate both **NoSQL (MongoDB Atlas)** and **SQL (Prisma ORM)** setups, including **JWT Authentication & Authorization**, containerization with **Docker**, and deployment on **AWS EC2**.  

---

## 📂 Projects

### 1. Course Selling Application
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
- Each project will include its own **Dockerfile**.
- Build Docker images with:
  ```bash
  docker build -t project-name .


docker run -p 3000:3000 project-name


## ☁️ Deployment (AWS EC2)
- Plan to deploy both backends on **AWS EC2**.
- Steps will include:
  1. Launching an EC2 instance
  2. Installing Node.js & Docker
  3. Running the application container(s)
  4. Configuring security groups for access