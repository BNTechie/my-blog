const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const openDatabase = require("./database");

function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function initDatabase() {
  const db = await openDatabase();

  await db.exec(`
    DROP TABLE IF EXISTS mood_records;
    DROP TABLE IF EXISTS user_summary;

    CREATE TABLE mood_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      week INTEGER,
      age INTEGER,
      sex TEXT,
      trajectory_type TEXT,
      phq9_score INTEGER,
      phq9_category TEXT,
      sleep_hours REAL,
      physical_activity_days INTEGER,
      stress_level INTEGER,
      medication_status TEXT,
      high_risk_flag TEXT,
      created_at TEXT
    );

    CREATE TABLE user_summary (
      user_id TEXT PRIMARY KEY,
      age INTEGER,
      sex TEXT,
      trajectory_type TEXT,
      baseline_score INTEGER,
      final_score INTEGER,
      mean_score REAL,
      max_score INTEGER,
      min_score INTEGER,
      high_risk_weeks INTEGER,
      change_from_baseline INTEGER
    );
  `);

  const moodData = await loadCSV(
    path.join(__dirname, "..", "data", "moodtrack_synthetic_phq9_dataset.csv")
  );

  const summaryData = await loadCSV(
    path.join(__dirname, "..", "data", "moodtrack_user_summary.csv")
  );

  for (const row of moodData) {
    await db.run(
      `
      INSERT INTO mood_records (
        user_id, week, age, sex, trajectory_type, phq9_score,
        phq9_category, sleep_hours, physical_activity_days,
        stress_level, medication_status, high_risk_flag, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        row.user_id,
        Number(row.week),
        Number(row.age),
        row.sex,
        row.trajectory_type,
        Number(row.phq9_score),
        row.phq9_category,
        Number(row.sleep_hours),
        Number(row.physical_activity_days),
        Number(row.stress_level),
        row.medication_status,
        row.high_risk_flag,
        row.created_at
      ]
    );
  }

  for (const row of summaryData) {
    await db.run(
      `
      INSERT INTO user_summary (
        user_id, age, sex, trajectory_type, baseline_score,
        final_score, mean_score, max_score, min_score,
        high_risk_weeks, change_from_baseline
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        row.user_id,
        Number(row.age),
        row.sex,
        row.trajectory_type,
        Number(row.baseline_score),
        Number(row.final_score),
        Number(row.mean_score),
        Number(row.max_score),
        Number(row.min_score),
        Number(row.high_risk_weeks),
        Number(row.change_from_baseline)
      ]
    );
  }

  console.log("SQLite database initialized successfully.");
  console.log("Mood records inserted:", moodData.length);
  console.log("Summary records inserted:", summaryData.length);

  await db.close();
}

initDatabase();
