const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function openDatabase() {
  return open({
    filename: path.join(__dirname, "moodtrack.db"),
    driver: sqlite3.Database
  });
}

module.exports = openDatabase;
