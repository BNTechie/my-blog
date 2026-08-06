const express = require("express");
const router = express.Router();

function linearRegression(data) {
  const n = data.length;

  const sumX = data.reduce((sum, row) => sum + row.week, 0);
  const sumY = data.reduce((sum, row) => sum + row.phq9_score, 0);
  const sumXY = data.reduce((sum, row) => sum + row.week * row.phq9_score, 0);
  const sumX2 = data.reduce((sum, row) => sum + row.week * row.week, 0);

  const slope =
    (n * sumXY - sumX * sumY) /
    (n * sumX2 - sumX * sumX);

  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

module.exports = function (db) {
  router.get("/:user_id", async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT week, phq9_score FROM mood_records WHERE user_id = ? ORDER BY week",
        [req.params.user_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = rows.map((row) => ({
        week: Number(row.week),
        phq9_score: Number(row.phq9_score)
      }));

      const { slope, intercept } = linearRegression(data);

      const nextWeek = Math.max(...data.map((row) => row.week)) + 1;
      let predictedScore = slope * nextWeek + intercept;

      predictedScore = Math.round(Math.max(0, Math.min(27, predictedScore)));

      let riskLevel = "low";

      if (predictedScore >= 15) {
        riskLevel = "high";
      } else if (predictedScore >= 10) {
        riskLevel = "moderate";
      }

      res.json({
        user_id: req.params.user_id,
        next_week: nextWeek,
        predicted_phq9_score: predictedScore,
        trend_slope: Number(slope.toFixed(2)),
        risk_level: riskLevel
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
