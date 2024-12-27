const express = require("express");
const router = express.Router();
const connection = require("../server/database/connection");
const bcrypt = require("bcrypt");

router.post("/get-data-form", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO visitors (email, username, password) VALUES (?, ?, ?)";
    connection.query(query, [email, username, hashedPassword], (err) => {
      if (err) {
        console.error("Couldnt save the information:", err);
        return res.status(500).send("Couldn't save the data");
      }
      res.send("Data saved successfully!");
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Error saving data");
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = "SELECT password FROM visitors WHERE username = ?";

  connection.query(query, [username], async (err, results) => {
    if (results.length === 0) {
      console.error("User not found");
      return res.status(401).send("Invalid username or password");
    }
    const hashedPassword = results[0].password;

    try {
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        res.send("Login succesful!");
      } else {
        res.status(401).send("Invalid password");
      }
    } catch (error) {
        console.error("Error during password comparison: ", error);
        res.status(500).send("Authentification error");
    }
  })
})

router.get("/get-data", (req, res) => {
  const query = "SELECT * FROM visitors";
  connection.query(query, (err, result) => {
    if (err) {
      console.error("You couldn't get the data:", err);
      return res.status(500).send("Couldn't fetch the data");
    }
    res.json(result);
  })
})

module.exports = router;