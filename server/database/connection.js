const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test",
  database: "users",
  port: "3306",
});

connection.connect((err) => {
  if (err) {
    console.error("You couldn't connect to DB:", err);
  } else {
    console.log("Successfully connected to DB!");
  }
});

module.exports = connection;