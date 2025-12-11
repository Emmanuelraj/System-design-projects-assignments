Absolutely — here is your **fully updated README.md**, exactly as you provided, **with the `.env` / PORT section already included**, and **unchanged anywhere else**.

This is the **final clean version**, ready to copy/paste.

---

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

## ⚠️ NEW — Handling `.env` and PORT on Windows On-Prem

### Important Notes

* Your `.env` file is **correctly ignored** and **should not be pushed to GitLab**.
* On a Windows on-prem server **you MUST create a `.env` manually**.

### What to put inside `.env`

```
PORT=3000
```

### Why?

PM2 (and Node.js) will read this value during startup.

### What happens if you do NOT create `.env`?

If your code already has:

```js
const PORT = process.env.PORT || 3000;
```

Then **your app will still run on port 3000**.
`.env` is optional but **recommended** so your configuration lives outside your code.

---

## 🆕 Where to create `.env`?

On the Windows server:

```
C:\path\to\your\project\.env
```

Create manually:

```txt
PORT=3000
```

You only need to do this **once**.

---

## ⛔ No Need to Set PORT in GitLab CI/CD

Because your app runs on the **Windows server**, not GitLab —
GitLab runner just pulls code and restarts PM2.
The server itself decides the port.

---

## 🔐 Optional but Recommended `.env` Variables

If you need more env variables later:

```
DB_URL=mongodb://...
API_KEY=xxxx
PORT=3000
```

PM2 automatically loads `.env` when running Node.js apps.

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

Click **New project runner**, select **Windows**, then use the token shown.

On Windows server:

```sh
gitlab-runner register
```

Fill prompts:

| Prompt             | Answer                                   |
| ------------------ | ---------------------------------------- |
| GitLab URL         | [https://gitlab.com](https://gitlab.com) |
| Registration Token | (paste token from GitLab)                |
| Description        | windows-runner                           |
| Tags               | windows                                  |
| Executor           | shell                                    |

---

## ✅ 6. Create `.gitlab-ci.yml`

Place this file in **project root**:

```yaml
stages:
  - deploy

deploy_to_windows:
  stage: deploy
  tags:
    - windows
  script:
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

This automatically deploys whenever you push to **main**.

---

## 🆕 IMPORTANT — You Do NOT Set PORT Inside CI

The `.gitlab-ci.yml` remains unchanged.
The Windows server already has `.env`, so PM2 loads the environment on each restart.

---

## ✅ 7. First-Time Setup on Windows (Run Once)

```sh
git clone <your-gitlab-repo>
cd <project-folder>

# Create .env here (IMPORTANT)
echo PORT=3000 > .env

npm install
pm2 start src/index.js --name crud-notes-app
pm2 save
```

PM2 will now manage the app.

---

## ✅ 8. Automatic Deployment (CD)

Every time you push:

```sh
git add .
git commit -m "update"
git push
```

GitLab will automatically:

✔ Fetch latest code
✔ Install dependencies
✔ Restart PM2
✔ Deploy the new version

🎉 **Full CI/CD achieved!**

---

## 🎯 Summary

| Feature                            | Status |
| ---------------------------------- | ------ |
| GitLab CI enabled                  | ✔      |
| GitLab Runner installed on Windows | ✔      |
| PM2 manages Node.js                | ✔      |
| Auto deploy on push                | ✔      |
| Local `.env` ignored               | ✔      |
| On-prem `.env` required            | ✔      |
| No Docker required                 | ✔      |

---

## 🎉 You Now Have Full CI/CD to Windows On-Prem

```

---

If you want, I can also add:

✅ `.env.example`  

```
