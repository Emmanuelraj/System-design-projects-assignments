Absolutely! Here’s a **clear step-by-step README.md** section you can use for Postman testing your API. I’ll focus on **login, signup, and protected product routes**.

---

````markdown
# Product Catalog API - Postman Testing Guide

This guide walks through testing the API step-by-step in Postman, covering both **positive** and **negative** cases.

---

## 1. Signup a New User

**Endpoint:** `POST /users/signup`  
**Body (JSON):**
```json
{
  "userName": "john",
  "password": "123456"
}
````

**Expected Result (Positive):**

* Status: `201 Created`
* Response: User created object

**Negative Cases:**

* Missing username or password → Status `400` or error message.

---

## 2. Login

**Endpoint:** `POST /users/login`
**Body (JSON):**

```json
{
  "userName": "john",
  "password": "123456"
}
```

**Expected Result (Positive):**

* Status: `200 OK`
* Response: `{ message: "Login successful", token: "<JWT_TOKEN>" }`

**Negative Cases:**

* Wrong password → `password is mismatching please check`
* Non-existent user → `User not found`

**Note:** Copy the token for the next steps.

---

## 3. Create a Product (Protected)

**Endpoint:** `POST /products`
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "Laptop",
  "price": 1200
}
```

**Expected Result (Positive):**

* Status: `201 Created`
* Response: `{ message: "Product created", product: { ... } }`

**Negative Cases:**

* Missing title or price → `400 Bad Request`
* Invalid JWT → `Unauthorized user please login again`

---

## 4. Get All Products (Protected)

**Endpoint:** `GET /products`
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Result:**

* Status: `200 OK`
* Response: `{ products: [ ... ] }`

**Negative Cases:**

* Invalid token → `Unauthorized user please login again`
* No products → `"products is Empty"`

---

## 5. Get Single Product by ID (Protected)

**Endpoint:** `GET /products/:id`
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Result:**

* Status: `200 OK`
* Response: `{ message: "Product found", product: { ... } }`

**Negative Cases:**

* Product does not belong to user → `404 Product not found or not owned by you`
* Invalid ID → `404 Product not found`

---

## 6. Update Product (Protected)

**Endpoint:** `POST /products/:id`
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "Laptop Pro",
  "price": 1500
}
```

**Expected Result:**

* Status: `200 OK`
* Response: `{ message: "Product updated", product: { ... } }`

**Negative Cases:**

* Product ID not found → `404 Product not found or not owned by you`
* Invalid JWT → `Unauthorized user please login again`

---

## 7. Delete Product (Protected)

**Endpoint:** `DELETE /products/:id`
**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Result:**

* Status: `200 OK`
* Response: `{ message: "Product deleted", product: { ... } }`

**Negative Cases:**

* Product ID not found or not owned → `404 Product not found or not owned by you`
* Invalid token → `Unauthorized user please login again`

---

## Notes:

* Always use the JWT token returned from login in the `Authorization` header for protected routes.
* Ensure `Content-Type: application/json` is set for POST/PUT routes.
* Test both positive (valid data) and negative (missing fields, wrong token, unauthorized access) scenarios.

```

---

If you want, I can **also add a small Postman collection JSON** that you can import directly and test all routes automatically.  

Do you want me to do that?
```
