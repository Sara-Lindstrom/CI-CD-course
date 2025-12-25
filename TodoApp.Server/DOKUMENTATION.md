# Todo API Documentation (TodoApp.Server)
This document explains how to use the Todo API (ASP.NET Core .NET 8) in this repo: 
    - **which endpoints exist**
    - **what you send**
    - **What you get back**

## Base URL (local development)

When running with https, the backend typically listens on:

- **HTTPS:** `https://localhost:7293`
- **HTTP:** `http://localhost:5159`

---

## Content type

All request bodies are JSON:

- Request header: `Content-Type: application/json`
- Responses are JSON (except `204 No Content`).

### TodoItem (JSON)
{
  "id": 1,
  "title": "Buy milk",
  "isDone": false,
  "isUrgent": false,
  "createdDate": "2025-12-25T09:00:00.0000000+01:00"
}

### Field rules:
- `id` is set by the server when you create an item.
- `title` is **required** and must be **max 50 characters**.
- `isDone` is forced to `false` when you create an item.
- `isUrgent` is forced to `false` if not set to true byb user.
- `createdDate` is set by the server when you create an item.

---

# Endpoints

## Get all todos
`GET /Todo`

**Request:** no body
**Response:** `200 OK` with an array of `TodoItem`.

---

## Get a single todo by id
`GET /Todo/{id}`

**Path parameters:**
- `id` (int) = todo id

**Response:**
- `200 OK` with a `TodoItem`
- `404 Not Found` if the id does not exist

---

## Create a todo
`POST /Todo/add`

**Request body:** 
`TodoItem` (only `title` is required; `isUrgent` is optional)

Minimal body (JSON):
{
  "title": "Write documentation",
  "isUrgent": true
}

**Server behavior:**
- Assigns a new `id`
- Sets `isDone` to `false`
- Sets `createdDate` to the current time

**Response:**
- `201 Created` with the created `TodoItem` in the body
- `400 Bad Request` if validation fails (for example missing `title` or title too long)

---

## Update a todo
`POST /Todo/update`

**Request body:** 
full `TodoItem` (must include a valid `id`)

Example body (JSON):
{
  "id": 1,
  "title": "Write API documentation",
  "isDone": true,
  "isUrgent": false
}

**Notes:**
- `createdDate` is not updated by updateing todo.

**Response:**
- `200 OK` with the updated `TodoItem`
- `404 Not Found` if the id does not exist
- `400 Bad Request` if validation fails

---

## Delete a todo
`POST /Todo/delete`

**Request body:** 
a JSON integer (the id)

Example body (JOSN):
1

**Response:**
- `204 No Content` when deleted
- `404 Not Found` if the id does not exist

---

# Swagger (Development only)
When the app runs in Development, Swagger UI is enabled!