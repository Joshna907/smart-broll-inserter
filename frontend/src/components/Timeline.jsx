import mockPlan from "../mockPlan";

function Timeline() {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Generated Timeline</h2>
      <p>Total Duration: {mockPlan.duration}s</p>

      <div style={{ marginTop: "16px" }}>
        {mockPlan.steps.map(step => (
          <div
            key={step.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px"
            }}
          >
            <strong>B-roll:</strong> {step.content.camera}
            <br />
            <strong>Time:</strong>{" "}
            {step.content.start}s → {step.content.end}s
            <br />
            <strong>Reason:</strong> {step.content.reason}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
