Perfect! Here’s a **full API workflow** ready to copy-paste into your `README.md` with **generic data**, including signup, login, create todo, and get todos.

```markdown
# Todo API

This is a simple Todo API with user authentication using JWT.  

## Base URL

```

[http://localhost:2000](http://localhost:2000)

````

---

## 1. Signup

**POST** `/users/signup`  

**Body (JSON)**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
````

**Expected Response**

```json
{
  "message": "You are signed up"
}
```

---

## 2. Login

**POST** `/users/login`

**Body (JSON)**

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

**Expected Response**

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```

> Copy the `token` for the next steps.

---

## 3. Create Todo

**POST** `/todos`

**Headers**

```
Authorization: JWT_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON)**

```json
{
  "title": "Buy groceries"
}
```

**Expected Response**

```json
{
  "message": "Todo created",
  "todo": {
    "_id": "64f...",
    "title": "Buy groceries",
    "done": false,
    "userId": "USER_ID_HERE",
    "__v": 0
  }
}
```

---

## 4. Get Todos

**GET** `/todos`

**Headers**

```
Authorization: JWT_TOKEN_HERE
```

**Expected Response**

```json
{
  "todos": [
    {
      "_id": "64f...",
      "title": "Buy groceries",
      "done": false,
      "userId": "USER_ID_HERE",
      "__v": 0
    }
    // ... other todos
  ]
}
```

---

## Testing Notes

1. Start with **signup** to create a new user.
2. **Login** to get the JWT token.
3. Include the token in the **Authorization** header for all `/todos` requests.
4. Use **POST /todos** to create todos, and **GET /todos** to fetch all todos for the logged-in user.
5. Tokens expire in **15 minutes**, after which you need to login again.

```

This covers the **entire process** in a clear, ready-to-use format for Postman testing.  

```
