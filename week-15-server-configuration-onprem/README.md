Sure! Here is a **complete, clean, production-ready `README.md`**, including:

✅ Full step-by-step setup
✅ Architecture diagram reference
✅ Folder structure
✅ CI/CD explanation
✅ Commands
✅ Everything you need to paste directly into your GitLab repo

⚠️ **About the image:**
GitLab can only show images stored *inside the repo*.
So I will include a **placeholder**.
Just download the diagram I generated → save it into your project as:

```
docs/architecture-diagram.png
```

Then GitLab will display it correctly.

---

# 📘 **README.md (Copy–Paste This Entire File)**

```md
# Fullstack App – CI/CD Deployment to On-Prem Windows Server

This project demonstrates a **full CI/CD pipeline** using **GitLab**, **GitLab Runner**, and **NSSM** for deploying a **Node.js backend** and **React frontend** to an **on-prem Windows Server**.

The goal is simple:

➡️ **Push code → GitLab pipeline runs → Windows server updates automatically**  
No manual copying or building required.

---

# 📊 System Architecture

![Architecture Diagram](docs/architecture-diagram.png)

---

# 🗂 Project Structure

```

fullstack-app/
backend/
server.js
package.json
frontend/
(React project)
.gitlab-ci.yml
README.md

```

---

# 🧠 CI/CD Flow (Brain–Hands–Kitchen Analogy)

| Part | Meaning |
|------|---------|
| **GitLab = Brain** | detects changes & runs pipelines |
| **GitLab Runner = Hands** | installed on Windows Server, executes commands |
| **Windows Server = Kitchen** | where deployment happens |
| **TARGET_DIR = Table** | place where code is deployed |
| **NSSM = Chef** | keeps backend running as a Windows service |

---

# 🚀 Deployment Flow

```

You Push Code
│
▼
GitLab detects .gitlab-ci.yml
│
▼
Pipeline is triggered automatically
│
▼
GitLab Runner (on Windows Server) executes scripts
│
▼
Runner copies backend + build files to TARGET_DIR
│
▼
Runner restarts Windows Service (NSSM)
│
▼
App is deployed & live 🎉

````

---

# 🛠 1. Local Setup (Developer Laptop)

### Clone the repository
```bash
git clone https://gitlab.com/yourname/fullstack-app.git
cd fullstack-app
````

### Backend example (`backend/server.js`)

```js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({ message: "Backend working on Windows Server!" });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
```

### React frontend example (`frontend`)

```bash
cd frontend
npx create-react-app .
```

---

# 🖥 2. Windows Server Setup

### Create Deployment Directory

```
C:\Deployment\fullstack-app\
```

Inside it, GitLab Runner will place:

```
backend/
frontend/
```

---

# 🤖 3. Install GitLab Runner on Windows

### Run these commands in **Admin PowerShell**:

```powershell
mkdir C:\GitLab-Runner
cd C:\GitLab-Runner

Invoke-WebRequest -Uri https://gitlab-runner-download-url -OutFile gitlab-runner.exe
.\gitlab-runner.exe install
.\gitlab-runner.exe start
```

### Register Runner:

```powershell
.\gitlab-runner.exe register
```

Use:

```
GitLab URL: https://gitlab.com
Tags: on-prem-deploy
Executor: shell
```

---

# 🔐 4. GitLab CI/CD Variables

Go to:

**GitLab → Settings → CI/CD → Variables**

Add:

| Key                | Value                         |
| ------------------ | ----------------------------- |
| `TARGET_DIR`       | `C:\Deployment\fullstack-app` |
| `APP_SERVICE_NAME` | `fullstack-backend`           |

---

# ⚙️ 5. Install NSSM (Windows service for backend)

Download: [https://nssm.cc/download](https://nssm.cc/download)

Install the backend as a Windows service:

```powershell
C:\nssm\nssm.exe install fullstack-backend
```

Fill:

| Field             | Value                                 |
| ----------------- | ------------------------------------- |
| Path              | `C:\Program Files\nodejs\node.exe`    |
| Arguments         | `server.js`                           |
| Startup directory | `C:\Deployment\fullstack-app\backend` |

Start service:

```powershell
C:\nssm\nssm.exe start fullstack-backend
```

---

# 🧩 6. CI/CD Pipeline (`.gitlab-ci.yml`)

```yaml
stages:
  - build
  - deploy

variables:
  TARGET_DIR: "C:\\Deployment\\fullstack-app"

# Build backend
build_backend:
  stage: build
  script:
    - cd backend
    - npm install
  artifacts:
    paths:
      - backend/

# Build frontend
build_frontend:
  stage: build
  script:
    - cd frontend
    - npm install
    - npm run build
  artifacts:
    paths:
      - frontend/build/

# Deploy to Windows server
deploy_to_server:
  stage: deploy
  script:
    - Write-Host "Deploying backend & frontend to $env:TARGET_DIR"
    - Remove-Item "$env:TARGET_DIR\backend\*" -Recurse -Force -ErrorAction SilentlyContinue
    - Remove-Item "$env:TARGET_DIR\frontend\build\*" -Recurse -Force -ErrorAction SilentlyContinue
    - Copy-Item ".\backend\*" "$env:TARGET_DIR\backend\" -Recurse -Force
    - Copy-Item ".\frontend\build\*" "$env:TARGET_DIR\frontend\build\" -Recurse -Force
    - Restart-Service -Name $env:APP_SERVICE_NAME -Force
  only:
    - main
```

---

# 🧪 7. Testing CI/CD

Modify backend:

```bash
git add .
git commit -m "Updated backend message"
git push origin main
```

GitLab will:

✔ Build backend
✔ Build frontend
✔ Copy files to Windows TARGET_DIR
✔ Restart backend service
✔ App updates automatically 🎉

---

# 🎉 Done!

Your **full CI/CD pipeline** is now complete:

* No manual builds
* No manual copying
* No server login required
* Fully automated deployments

---

# 📎 Image storage note

Place your diagram here:

```
fullstack-app/docs/architecture-diagram.png
```

Then GitLab README will show it correctly.

```

---

If you want, I can also generate:

✅ A cleaner professional PDF  
✅ A company-style documentation page  
✅ A version with color-coded paths  


```
