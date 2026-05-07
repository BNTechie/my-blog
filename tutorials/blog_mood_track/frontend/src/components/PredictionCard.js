function PredictionCard({ prediction }) {
  if (!prediction) {
    return null;
  }

  return (
    <div className="prediction-card">
      <h2>Next Week Prediction</h2>

      <p>
        Predicted PHQ-9 score for week {prediction.next_week}:
        <strong> {prediction.predicted_phq9_score}</strong>
      </p>

      <p>
        Trend slope:
        <strong> {prediction.trend_slope}</strong>
      </p>

      <p>
        Risk level:
        <strong> {prediction.risk_level}</strong>
      </p>
    </div>
  );
}

export default PredictionCard;
