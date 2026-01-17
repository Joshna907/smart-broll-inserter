// FINAL FORCE PUSH: Relative URL Verified
const API_URL = '/api/plan';

// Default B-roll library to match against
const DEFAULT_BROLLS = [
  { id: 'broll_nature_1', metadata: 'Peaceful nature shot, forest with sunlight streaming through trees, calm atmosphere' },
  { id: 'broll_nature_2', metadata: 'Mountain landscape with clouds moving fast, time lapse, majestic view' },
  { id: 'broll_city_1', metadata: 'Busy city street with people walking, urban life, hustle and bustle' },
  { id: 'broll_city_2', metadata: 'Night time city skyline with lights, cyberpunk vibe, modern architecture' },
  { id: 'broll_tech_1', metadata: 'Close up of hands typing on a mechanical keyboard, coding, programming context' },
  { id: 'broll_tech_2', metadata: 'Futuristic server room with blinking lights, data center, technology concept' },
  { id: 'broll_office_1', metadata: 'Modern office workspace, people collaborating, whiteboard meeting' },
  { id: 'broll_coffee_1', metadata: 'Pouring hot coffee into a cup, steam rising, cozy morning vibe' },
  { id: 'broll_abstract_1', metadata: 'Abstract geometric shapes moving, motion graphics background' },
  { id: 'broll_network_1', metadata: 'Digital network connections, nodes connecting, internet visualization' }
];

export async function generateTimeline(videoUrl, customBRolls = null) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  a_roll: {
    url: videoUrl,
    metadata: "Talking head awareness video"
  },
  b_rolls: customBRolls || DEFAULT_BROLLS
})
,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
