const connection = require("../server/database/connection");

const addToDataBase = (email, username, hashedPassword, callback) => {
    const query = "INSERT INTO visitors (email, username, password) VALUES (?, ?, ?)";
    connection.query(query, [email, username, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }
      callback(null, result);
    });
  };

const checkDataBase = (username, callback) => {
    const query = "SELECT password FROM visitors WHERE username = ?";
    connection.query(query, [username], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }
        callback(null, result);
    })
}

const selectFromDataBase = (callback) => {
    const query = "SELECT * FROM candidates ORDER BY votes DESC";
    connection.query(query, (err, result) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }
         callback(null, result);
    })
}

const addCandidatesAndSortDesc = (callback) => {
    const query = `
  INSERT INTO candidates (email, username, password)
  SELECT email, username, password 
  FROM visitors 
  ORDER BY id DESC 
  LIMIT 1
`;
connection.query(query, (err, result) => {
    if (err) {
        console.error("Could not copy data from visitors to candidates:", err);
        return callback(err, null);
    }
    callback(null,  result);
})
}

const updateVotes = (candidateID, callback) => {
    const query = "UPDATE candidates SET votes = votes + 1 WHERE id = ?";
    connection.query(query, [candidateID], (err, result) => {
      callback(err, result);
    });
  };

  module.exports = {addToDataBase, checkDataBase, selectFromDataBase, addCandidatesAndSortDesc, updateVotes};