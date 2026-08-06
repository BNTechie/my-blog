function SummaryCards({ selectedUser, summaryData }) {
  const userSummary = summaryData.find(
    (row) => row.user_id === selectedUser
  );

  if (!userSummary) {
    return null;
  }

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <h3>Baseline Score</h3>
        <p>{userSummary.baseline_score}</p>
      </div>

      <div className="summary-card">
        <h3>Final Score</h3>
        <p>{userSummary.final_score}</p>
      </div>

      <div className="summary-card">
        <h3>Mean Score</h3>
        <p>{Number(userSummary.mean_score).toFixed(1)}</p>
      </div>

      <div className="summary-card">
        <h3>High-Risk Weeks</h3>
        <p>{userSummary.high_risk_weeks}</p>
      </div>
    </div>
  );
}

export default SummaryCards;
