const express = require("express");
const router = express.Router();

module.exports = function (db) {
  router.get("/", async (req, res) => {
    try {
      const users = await db.all(
        "SELECT DISTINCT user_id FROM mood_records ORDER BY user_id"
      );

      res.json(users.map((row) => row.user_id));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
