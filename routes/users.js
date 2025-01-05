const express = require("express");
const router = express.Router();
const connection = require("../server/database/connection");
const bcrypt = require("bcrypt");
const queries = require("../helpers/queries");

router.post("/users/register", async (req, res) => {
  const {username, password, email} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    queries.addToDataBase(email, username, hashedPassword, (err) => {
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

router.post("/users/login", (req, res) => {
  const {username, password} = req.body;
  queries.checkDataBase(username, async (err, results) => {
    if (results.length === 0) {
      console.error("User not found");
      return res.status(401).send("Invalid username or password");
    }
    const hashedPassword = results[0].password;
    const userEmail = results[0].email;
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        return res.json({message: "Login succesful", email: userEmail})
      } else {
        res.status(401).send("Invalid password");
      }
    } catch (error) {
      console.error("Error during password comparison: ", error);
      res.status(500).send("Authentification error");
    }
  });
});

router.get("/users/list", (req, res) => {
  queries.selectFromDataBase((err, result) => {
    if (err) {
      console.error("You couldn't get the data:", err);
      return res.status(500).send("Couldn't fetch the data");
    }
    res.json(result);
  });
});

router.post("/users/candidates", (req, res) => {
  queries.addCandidatesAndSortDesc((err, result) => {
    if (err) {
      console.error("Could not copy data from visitors to candidates:", err);
      return res.status(500).send("You're already a candidate!");
    }
    res.send("Data copied successfully!");
  });
});

router.post("/candidates/votes", (req, res) => {
  const {candidateID, email} = req.body;
  queries.checkIfVoted(email, (err, result) => {
    if (err) {
      console.error("Error checking voter in database ", err);
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "You have already voted!" });
    }
    queries.addVoters(email, (err, result) => {
      if (err) {
        console.error("Couldn't add the voter in database ", err);
      }
      queries.updateVotes(candidateID, (err, result) => {
        if (err) {
          console.error(err);
        }
        res.send("Table updated!");
      });
    });
  });
});

module.exports = router;
