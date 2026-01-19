# ⚡ fast Track: Deploy to AWS EC2

Follow these exact steps to get your app running with **1GB RAM** (No more crashes).

## 1. Launch a Server (5 mins)
1.  Log in to **[AWS Console](https://console.aws.amazon.com/ec2/v2/home)**.
2.  Click **"Launch Instances"**.
3.  **Name**: `B-Roll-Server`.
4.  **OS**: Choose **Ubuntu** (Ubuntu Server 24.04 LTS).
5.  **Instance Type**: `t2.micro` or `t3.micro` (Free Tier usage).
6.  **Key Pair**: Create new -> Name it `myserver-key` -> Download `.pem` file.
7.  **Network Settings**: Check ALL boxes:
    - [x] Allow SSH traffic
    - [x] Allow HTTPS traffic
    - [x] Allow HTTP traffic
8.  Click **Launch Instance**.

## 2. Connect (2 mins)
1.  Open your terminal on your computer.
2.  Move the key to a safe place: `mv ~/Downloads/myserver-key.pem .`
3.  Set permissions: `chmod 400 myserver-key.pem`
4.  Connect (Copy "Public IPv4 address" from AWS):
    ```bash
    ssh -i "myserver-key.pem" ubuntu@<YOUR-EC2-IP-ADDRESS>
    ```

## 3. Fast Install (3 mins)
Once connected to the server, copy-paste these commands:

```bash
# 1. Download the setup script I wrote for you
curl -O https://raw.githubusercontent.com/Joshna907/smart-broll-inserter/main/setup_ec2.sh

# 2. Run it (Installs Node, FFmpeg, Nginx)
# Note: You need to push setup_ec2.sh to git first! 
# Or just copy paste the content of setup_ec2.sh manually if you haven't pushed yet.
```
*Wait, you haven't pushed `setup_ec2.sh` yet. Just copy-paste this block into the server terminal:*

```bash
# AUTOMATED SETUP COMMAND BLOCK
sudo apt-get update -y
sudo apt-get install -y ffmpeg git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo ufw allow 'Nginx Full'
sudo ufw allow 5001
```


## 4. Run the App (2 mins)
```bash
# 1. Clone your code
git clone https://github.com/Joshna907/smart-broll-inserter.git
cd smart-broll-inserter/backend

# 2. Install dependencies
npm install

# 3. Create .env file
nano .env
# PASTE YOUR OPENAI_API_KEY inside! (CTRL+O to save, CTRL+X to exit)

# 4. Start the server
pm2 start src/server.js --name backend
```

## 5. Done!
 Your app is now running at `http://<YOUR-EC2-IP>:5001`.
 FFmpeg has access to **1GB RAM** and will likely **NOT crash**.
