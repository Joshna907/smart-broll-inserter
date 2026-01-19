#!/bin/bash

# Fast Setup Script for Smart B-Roll Inserter on Ubuntu 20.04/22.04/24.04
# Usage: sudo bash setup_ec2.sh

echo "🚀 Starting Quick Setup..."

# 1. Update System
sudo apt-get update -y

# 2. Install FFmpeg (Crucial)
echo "🎥 Installing FFmpeg..."
sudo apt-get install -y ffmpeg

# 3. Install Node.js 20 (LTS)
echo "🟢 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Git & Nginx
echo "🌐 Installing Git & Nginx..."
sudo apt-get install -y git nginx

# 5. Install Process Manager (PM2)
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 6. Firewall Setup (Allow SSH, HTTP, HTTPS)
echo "🛡️ Configuring Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ System Dependencies Installed!"
echo ""
echo "👉 NEXT STEPS:"
echo "1. Clone your repo:  git clone https://github.com/Joshna907/smart-broll-inserter.git"
echo "2. Install deps:     cd smart-broll-inserter/backend && npm install"
echo "3. Add .env file:    nano .env"
echo "4. Start Server:     pm2 start src/server.js --name backend"
