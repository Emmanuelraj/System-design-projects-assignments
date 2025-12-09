Here is the **clean, properly formatted `README.md`** — ready to copy/paste directly.
This is **100% Markdown**, no formatting issues.

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
**GitLab → Your Project → Settings → CI/CD → Runners → Registration Token**

//**GitLab → Your Project → Settings → CI/CD → Runners → Registration Token**

On Windows server, run:

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

## ✅ 7. First-Time Setup on Windows (Run Once)

```sh
git clone <your-gitlab-repo>
cd <project-folder>
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
| No Docker required                 | ✔      |

---

## 🎉 You Now Have Full CI/CD to Windows On-Prem

```
