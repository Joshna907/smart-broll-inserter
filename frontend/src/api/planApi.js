export async function generatePlan(payload) {
  const res = await fetch("http://localhost:5000/api/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to generate plan");
  }

  return res.json();
}
