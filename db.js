const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "crud_db",
  password: "366330",
  port: 5432,
});

pool.connect()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

module.exports = pool;