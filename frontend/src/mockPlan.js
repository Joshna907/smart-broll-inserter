const mockPlan = {
  planId: "demo-plan-123",
  duration: 58.3,
  steps: [
    {
      id: "step-1",
      type: "shot",
      content: {
        camera: "broll_1",
        start: 7.8,
        end: 10.3,
        reason: "Shows everyday street food context"
      }
    },
    {
      id: "step-2",
      type: "shot",
      content: {
        camera: "broll_3",
        start: 18.6,
        end: 21.1,
        reason: "Highlights hygiene concern mentioned in speech"
      }
    },
    {
      id: "step-3",
      type: "shot",
      content: {
        camera: "broll_6",
        start: 45.0,
        end: 48.0,
        reason: "Calm closing visual aligned with health message"
      }
    }
  ]
};

export default mockPlan;
