Below is your **fully updated `.gitlab-ci.yml`** AND your **fully updated README.md**, with your requested changes:

✔ `.env` is **not required** on Windows anymore
✔ Environment variables now come **only from GitLab CI/CD variables**
✔ README.md updated cleanly and professionally
✔ Added **“How to run Node.js app on Windows (Simple Steps)”** at the end
✔ Everything else kept **exactly the same** unless modification was required

---

# ✅ **Updated `.gitlab-ci.yml` (Final Version)**

```yaml
stages:
  - deploy

deploy_to_windows:
  stage: deploy
  tags:
    - windows
  script:
    - echo "Writing .env file from GitLab CI variables..."
    - echo "PORT=$PORT" > .env
    - echo "DB_URL=$DB_URL" >> .env
    - echo "API_KEY=$API_KEY" >> .env
    - echo "JWT_SECRET=$JWT_SECRET" >> .env

    - echo "Fetching latest code..."
    - git fetch --all
    - git reset --hard origin/main

    - echo "Installing dependencies..."
    - npm install

    - echo "Restarting PM2..."
    - pm2 restart crud-notes-app || pm2 start src/index.js --name crud-notes-app

  only:
    - main
```

✔ This creates/updates `.env` **on the Windows server** every deployment
✔ No need to manually create `.env` on the server
✔ All environment variables are now controlled by GitLab

---

# 📄 **Updated README.md (Final Clean Version)**

```md
# 🚀 CI/CD Guide — GitLab → Windows On-Prem Server (Node.js + PM2 + GitLab Runner)

This guide explains how to deploy a Node.js application from GitLab to a Windows on-premises server using:

- GitLab CI/CD  
- GitLab Runner (Windows)  
- PM2 (process manager)  
- No Docker  

---

## 📌 Pipeline Overview

```

Your Laptop → GitLab → GitLab CI/CD → GitLab Runner (Windows Server) → PM2 → Running App

````

---

## ✅ 1. Requirements

### **On Local Machine**
- Node.js  
- Git  
- GitLab account  

### **On Windows Server**
- Node.js  
- Git  
- PM2  
- GitLab Runner  

---

## ✅ 2. Push Your Code to GitLab

```sh
git init
git remote add origin <gitlab-url>
git add .
git commit -m "Initial commit"
git push -u origin main
````

---

## ✅ 3. Prepare the Windows Server

### Install Git

[https://git-scm.com/download/win](https://git-scm.com/download/win)

### Install Node.js

[https://nodejs.org](https://nodejs.org)

### Install PM2

```sh
npm install -g pm2
```

Enable PM2 auto-start:

```sh
pm2 startup
pm2 save
```

---

## ⚠️ Handling Environment Variables (IMPORTANT)

### 🎯 Now You **Do NOT** Need `.env` on the Windows Server

Instead, all environment variables will:

✔ Be stored in GitLab
✔ Be written automatically to `.env` during deployment
✔ Be used by PM2 when starting the Node.js app

This removes the need to manually maintain secrets on the Windows Server.

---

## 🟢 How To Add Environment Variables in GitLab

Go to:

**Project → Settings → CI/CD → Variables → Add Variable**

Example:

| Key        | Value       |
| ---------- | ----------- |
| PORT       | 3000        |
| DB_URL     | mongodb:... |
| API_KEY    | xxxx        |
| JWT_SECRET | yyyyy       |

These will be written to `.env` automatically during deployment.

---

## 🟣 NEW — Windows Server Does NOT Need `.env` Anymore

The `.gitlab-ci.yml` writes this file each deployment:

Example `.env` generated:

```
PORT=3000
DB_URL=...
API_KEY=...
JWT_SECRET=...
```

---

## ❗ Why this is better?

✔ No secrets stored manually on Windows
✔ Everything controlled from GitLab
✔ Easy to update variables
✔ CI/CD becomes the single source of truth

---

## ✅ 4. Install GitLab Runner (Windows)

Download:
[https://docs.gitlab.com/runner/install/windows.html](https://docs.gitlab.com/runner/install/windows.html)

Install:

```sh
gitlab-runner install
gitlab-runner start
```

---

## ✅ 5. Register the GitLab Runner

Go to:
**GitLab → Your Project → Settings → CI/CD → Runners → New project runner**

Then run on Windows:

```sh
gitlab-runner register
```

Provide:

| Prompt             | Answer                                   |
| ------------------ | ---------------------------------------- |
| GitLab URL         | [https://gitlab.com](https://gitlab.com) |
| Registration Token | (paste token)                            |
| Description        | windows-runner                           |
| Tags               | windows                                  |
| Executor           | shell                                    |

---

## ✅ 6. NEW Updated `.gitlab-ci.yml`

This version automatically creates `.env` on the Windows server:

```yaml
stages:
  - deploy

deploy_to_windows:
  stage: deploy
  tags:
    - windows
  script:
    - echo "Writing .env file from GitLab CI variables..."
    - echo "PORT=$PORT" > .env
    - echo "DB_URL=$DB_URL" >> .env
    - echo "API_KEY=$API_KEY" >> .env
    - echo "JWT_SECRET=$JWT_SECRET" >> .env

    - echo "Fetching latest code..."
    - git fetch --all
    - git reset --hard origin/main

    - echo "Installing dependencies..."
    - npm install

    - echo "Restarting PM2..."
    - pm2 restart crud-notes-app || pm2 start src/index.js --name crud-notes-app

  only:
    - main
```

---

## 🚀 7. First-Time Setup on Windows (Run Once Only)

```sh
git clone <your-gitlab-repo>
cd <project-folder>
npm install
pm2 start src/index.js --name crud-notes-app
pm2 save
```

No `.env` needed anymore.

---

# 🟦 8. VERY SIMPLE — How to Run Your Node.js App on Windows (PM2 Guide)

### ✔ Start App

```sh
pm2 start src/index.js --name crud-notes-app
```

### ✔ Restart App

```sh
pm2 restart crud-notes-app
```

### ✔ Stop App

```sh
pm2 stop crud-notes-app
```

### ✔ View Logs

```sh
pm2 logs crud-notes-app
```

### ✔ See All PM2 Processes

```sh
pm2 list
```

### ✔ Enable Auto-Start on Server Boot

```sh
pm2 save
pm2 startup
```

---

## 🎯 Summary

| Feature                           | Status |
| --------------------------------- | ------ |
| GitLab CI enabled                 | ✔      |
| GitLab Runner on Windows          | ✔      |
| PM2 manages Node.js               | ✔      |
| Auto deployment on push           | ✔      |
| Environment stored in GitLab only | ✔      |
| `.env` auto-created via pipeline  | ✔      |
| No manual env on server           | ✔      |
| No Docker required                | ✔      |

---

## 🎉 You Now Have a Fully Automated CI/CD Pipeline to Windows On-Prem

```

---

# ⚡ Ready to go!

If you'd like, I can also:

✅ Add a troubleshooting section  
✅ Add a pipeline flow diagram  
✅ Add `.env.example`  
✅ Optimize the PM2 ecosystem file  


```
