# Smart B-Roll Inserter

A full-stack application that automatically analyzes talking-head (A-roll) videos and intelligently inserts relevant B-roll clips using AI.

## Features

- **Automated Transcription**: Uses OpenAI Whisper to transcribe A-roll audio with timestamps.
- **Visual Understanding**: Uses GPT-4o Vision to automatically generate descriptions for B-roll clips (even with missing metadata).
- **Smart Matching**: Semantic matching of spoken content to visual clips using embeddings and AI reasoning.
- **Dynamic Timeline**: Generates a strictly formatted JSON timeline plan.
- **Video Rendering**: Automatically overlays B-roll clips onto the A-roll using FFmpeg.
- **Interactive Dashboard**: React-based UI to upload videos, visualize the timeline, and download the final cut.

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, Vite, Tailwind CSS
- **AI/ML**: OpenAI API (GPT-4o, Whisper, Embeddings)
- **Media Processing**: FFmpeg

## Setup Instructions

### Prerequisites
1.  Node.js (v18+)
2.  FFmpeg installed and added to system PATH.
3.  OpenAI API Key.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5001
```

Start the server:
```bash
npm start
```
The server will run on `http://localhost:5001`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Usage

1.  Open the Dashboard (`http://localhost:5173`).
2.  Paste an A-roll video URL (e.g., a public MP4 link).
3.  (Optional) Paste a JSON list of B-roll clips in the "Advanced Configuration" section. If left empty, it will interpret them as needed if logic allows, or you can use the provided test data schema.
4.  Click **"Generate Timeline"**.
5.  View the generated plan, timeline visualization, and raw JSON output.
6.  Click **"Download Final Cut"** to get the rendered video.

## Project Structure

- `backend/src/services`: Core logic (Transcription, Matching, Rendering, etc.).
- `backend/public/outputs`: Generated artifacts (JSON plans, rendered videos).
- `frontend/src/components`: React UI components.
