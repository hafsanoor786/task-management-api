console.log("MY TASK MANAGEMENT APP IS RUNNING");

const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());


// ==================== HOME ====================

app.get("/", (req, res) => {
  res.send("Task Management API is running");
});


// ==================== TEST ====================

app.get("/test", (req, res) => {
  res.send("Test route is working!");
});


// ==================== USERS ====================

// Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Users GET Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.log("Users POST Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Update user

app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           password = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, password, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log("User PATCH Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Delete user

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.log("User DELETE Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== LOGIN ====================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: result.rows[0]
    });

  } catch (error) {
    console.log("Login Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});


// ==================== PROJECTS ====================

// Get all projects
app.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Projects GET Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});


// Add new project
// Add new project
app.post("/projects", async (req, res) => {
  try {
    const { name, description, user_id } = req.body;

    // Validation
    if (!name || !user_id) {
      return res.status(400).json({
        error: "Name and user_id are required"
      });
    }

    const result = await pool.query(
      "INSERT INTO projects (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, user_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.log("Projects POST Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Update project

app.patch("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, user_id } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET name = $1,
           description = $2,
           user_id = $3
       WHERE id = $4
       RETURNING *`,
      [name, description, user_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log("Project PATCH Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Delete project

app.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      project: result.rows[0]
    });

  } catch (error) {
    console.log("Project DELETE Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== TASKS ====================
// Add new task
app.post("/tasks", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      due_date,
      project_id,
      user_id
    } = req.body;

    // Validation
    if (!title || !project_id || !user_id) {
      return res.status(400).json({
        error: "Title, project_id and user_id are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
      (title, description, status, due_date, project_id, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        title,
        description,
        status || "pending",
        due_date,
        project_id,
        user_id
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.log("Tasks POST Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Update task

app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      due_date,
      project_id,
      user_id
    } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           due_date = $4,
           project_id = $5,
           user_id = $6
       WHERE id = $7
       RETURNING *`,
      [
        title,
        description,
        status,
        due_date,
        project_id,
        user_id,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log("Task PATCH Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Delete task

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: result.rows[0]
    });

  } catch (error) {
    console.log("Task DELETE Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== TASK DETAILS / JOIN ====================

// Get tasks with search, filtering, pagination and sorting

app.get("/tasks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "";

    const sort = req.query.sort || "id";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const allowedSortColumns = [
      "id",
      "title",
      "status",
      "due_date",
      "created_at"
    ];

    if (!allowedSortColumns.includes(sort)) {
      return res.status(400).json({
        error: "Invalid sort column"
      });
    }

    let query = "SELECT * FROM tasks WHERE 1=1";
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND title ILIKE $${values.length}`;
    }

    if (status) {
      values.push(status);
      query += ` AND status = $${values.length}`;
    }

    query += ` ORDER BY ${sort} ${order}`;
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.status(200).json({
      page,
      limit,
      search,
      status,
      tasks: result.rows
    });

  } catch (error) {
    console.log("Tasks GET Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== TASK DETAILS / JOIN ====================

app.get("/tasks/details", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.due_date,
        users.name AS user_name,
        users.email AS user_email,
        projects.name AS project_name
      FROM tasks
      JOIN users ON tasks.user_id = users.id
      JOIN projects ON tasks.project_id = projects.id
      ORDER BY tasks.id ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.log("Task Details Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== OVERDUE TASKS ====================

app.get("/tasks/overdue", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM tasks
      WHERE due_date < CURRENT_DATE
      AND status != 'completed'
      ORDER BY due_date ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.log("Overdue Tasks Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== DASHBOARD ====================

app.get("/dashboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending
      FROM tasks
    `);

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log("Dashboard Error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== SERVER ====================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});