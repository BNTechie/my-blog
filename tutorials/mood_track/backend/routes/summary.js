const express = require("express");
const router = express.Router();

module.exports = function (db) {
  router.get("/", async (req, res) => {
    try {
      const rows = await db.all("SELECT * FROM user_summary ORDER BY user_id");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
