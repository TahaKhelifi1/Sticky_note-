const mysql = require('mysql2');
require('dotenv').config();

// Use correct environment variable names
const dbConfig = {
  host:'localhost',       
  user: 'root',           
  password: '',
  database: 'sticky_notes_app',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(err => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      setTimeout(handleDisconnect, 5000); // Retry after 5 seconds
    } else {
      console.log(" Connected to the MySQL database!");
    }
  });

  connection.on("error", err => {
    console.error(" MySQL error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      console.log(" Reconnecting to MySQL...");
      handleDisconnect();
    }
  });
}

// Start the initial connection
handleDisconnect();

module.exports = connection;
