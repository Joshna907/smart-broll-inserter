# How to Deploy on Render.com

You are deploying a **Monolith** (Frontend + Backend) using **Docker**.

### Step 1: Push to GitHub
Ensure you have pushed the latest code (including `Dockerfile`) to your repo:
`https://github.com/Joshna907/smart-broll-inserter`

### Step 2: Create Service on Render
1.  Log in to [dashboard.render.com](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Select **"Build and deploy from a Git repository"**.
4.  Connect your GitHub account and select `smart-broll-inserter`.

### Step 3: Configure settings (Crucial!)
*   **Name**: `smart-broll-app` (or whatever you like).
*   **Region**: `Singapore (Southeast Asia)` (or closest to you).
*   **Branch**: `main`.
*   **Runtime**: **Docker** (Select this explicitly!).
*   **Instance Type**: **Free** (or Starter).

### Step 4: Environment Variables 🔑
Scroll down to "Environment Variables" and add:
*   `OPENAI_API_KEY`: `sk-.....` (Paste your key here).
*   `PORT`: `5001`.

### Step 5: Deploy
Click **Create Web Service**.

---

### What happens next?
1.  Render sees the `Dockerfile`.
2.  it pulls `node:18-slim` and installs `ffmpeg`.
3.  It runs `npm install` for backend and frontend.
4.  It runs `npm run build` for frontend.
5.  It starts the server on Port `5001`.
6.  **Done!** Your app will be live at `https://smart-broll-app.onrender.com`.

### Troubleshooting
*   **Build takes forever?**: Docker builds take 3-5 mins because of FFmpeg. Be patient.
