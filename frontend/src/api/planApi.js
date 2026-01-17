// Production: URL Fix Verified
export async function generatePlan(payload) {
  // Relative URL for Production (Monolith) verification
  const res = await fetch("/api/plan", {
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
