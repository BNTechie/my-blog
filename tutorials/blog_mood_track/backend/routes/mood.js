const express = require("express");
const router = express.Router();

module.exports = function (db) {
  router.get("/", async (req, res) => {
    try {
      const rows = await db.all("SELECT * FROM mood_records");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:user_id", async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT * FROM mood_records WHERE user_id = ? ORDER BY week",
        [req.params.user_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
