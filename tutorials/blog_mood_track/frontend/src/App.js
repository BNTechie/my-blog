import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import UserSelector from "./components/UserSelector";
import MoodChart from "./components/MoodChart";
import SummaryCards from "./components/SummaryCards";
import PredictionCard from "./components/PredictionCard";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [moodData, setMoodData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL + "/api/users")
      .then((res) => {
        setUsers(res.data);
        setSelectedUser(res.data[0]);
      })
      .catch((err) => console.error("Error fetching users:", err));

    axios
      .get(API_URL + "/api/summary")
      .then((res) => {
        setSummaryData(res.data);
      })
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(API_URL + "/api/mood/" + selectedUser)
        .then((res) => {
          const cleanedData = res.data.map((row) => ({
            week: Number(row.week),
            phq9_score: Number(row.phq9_score)
          }));

          setMoodData(cleanedData);
        })
        .catch((err) => console.error("Error fetching mood data:", err));

      axios
        .get(API_URL + "/api/prediction/" + selectedUser)
        .then((res) => {
          setPrediction(res.data);
        })
        .catch((err) => console.error("Error fetching prediction:", err));
    }
  }, [selectedUser]);

  return (
    <div className="App">
      <header className="header">
        <h1>MoodTrack Dashboard</h1>
        <p>Visualizing synthetic PHQ-9 trajectories with predictive insights</p>
      </header>

      <main className="container">
        <UserSelector
          users={users}
          selectedUser={selectedUser}
          onUserChange={setSelectedUser}
        />

        <SummaryCards
          selectedUser={selectedUser}
          summaryData={summaryData}
        />

        <PredictionCard prediction={prediction} />

        <MoodChart moodData={moodData} />
      </main>
    </div>
  );
}

export default App;
