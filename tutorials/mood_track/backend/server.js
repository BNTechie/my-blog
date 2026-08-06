const express = require("express");
const cors = require("cors");
require("dotenv").config();

const openDatabase = require("./db/database");

const usersRouter = require("./routes/users");
const moodRouter = require("./routes/mood");
const summaryRouter = require("./routes/summary");
const predictionRouter = require("./routes/prediction");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const db = await openDatabase();

    // Root route (important for Render testing)
    app.get("/", (req, res) => {
      res.json({
        status: "OK",
        message: "MoodTrack backend is live"
      });
    });

    // Health route
    app.get("/api/health", (req, res) => {
      res.json({
        status: "OK",
        message: "MoodTrack API is running with SQLite"
      });
    });

    // API routes
    app.use("/api/users", usersRouter(db));
    app.use("/api/mood", moodRouter(db));
    app.use("/api/summary", summaryRouter(db));
    app.use("/api/prediction", predictionRouter(db));

    app.listen(PORT, () => {
      console.log("MoodTrack API running on port " + PORT);
      console.log("Connected to SQLite database");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
