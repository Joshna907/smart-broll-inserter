# Dockerfile for Smart B-Roll Inserter (Monolith)

# Use Node.js 18 on Debian (Slim) to support apt-get
FROM node:18-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set Working Directory
WORKDIR /app

# Copy Backend Dependencies first (Caching)
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy Frontend Dependencies (Caching)
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy Source Code
WORKDIR /app
COPY . .

# Build Frontend
WORKDIR /app/frontend
RUN npm run build

# Move Frontend Build to Backend Public
# Ensure backend/public exists
WORKDIR /app/backend
RUN mkdir -p public
# Copy dist contents to public (Render/Docker specific step)
RUN cp -r ../frontend/dist/* public/

# Expose Port
EXPOSE 5001

# Start Server
CMD ["node", "src/server.js"]
