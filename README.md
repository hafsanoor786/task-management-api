# Task Management REST API

A RESTful Task Management API built with Express.js and PostgreSQL.

## Technologies Used

* Node.js
* Express.js
* PostgreSQL
* Postman

## Features

* User Registration
* User Login
* User CRUD Operations
* Project CRUD Operations
* Task CRUD Operations
* Task Search and Filtering
* Pagination
* Sorting
* Overdue Tasks
* PostgreSQL JOIN Queries
* Dashboard Statistics
* Validation and Error Handling

## Database Tables

### Users

Stores user information.

### Projects

Stores projects and their related users.

### Tasks

Stores tasks and their related projects and users.

## API Endpoints

### Users

* `POST /users` - Register User
* `GET /users` - Get All Users
* `PATCH /users/:id` - Update User
* `DELETE /users/:id` - Delete User

### Authentication

* `POST /login` - User Login

### Projects

* `POST /projects` - Create Project
* `GET /projects` - Get All Projects
* `PATCH /projects/:id` - Update Project
* `DELETE /projects/:id` - Delete Project

### Tasks

* `POST /tasks` - Create Task
* `GET /tasks` - Get All Tasks
* `PATCH /tasks/:id` - Update Task
* `DELETE /tasks/:id` - Delete Task
* `GET /tasks/details` - Get Task Details using JOIN
* `GET /tasks/overdue` - Get Overdue Tasks

### Search, Filtering, Pagination & Sorting

Example:

`GET /tasks?search=Portfolio&status=pending`

`GET /tasks?page=1&limit=1`

`GET /tasks?sort=title&order=desc`

### Dashboard

`GET /dashboard`

Returns total, completed and pending task counts.

## How to Run

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Configure PostgreSQL database in `db.js`.
4. Start the server:

```bash
node app.js
```

5. Server runs on:

`http://localhost:5000`

## Postman

The Postman collection contains the API requests used for testing the Task Management REST API.
