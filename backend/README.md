# AFK Console Client - Backend Setup

## Quick Start

1. Copy these files to your server/VPS
2. Run `npm install`
3. Run `node start.js` or `npm start`
4. Backend will start on port **1043**

## Frontend Connection

### If Backend is on the Same Computer:
1. Open the frontend app
2. Go to **Settings** page
3. URL should be: `http://localhost:1043`
4. Click "Test" to verify connection
5. Click "Save & Reconnect"

### If Backend is on a Different Computer:
1. Find your backend server's IP address:
   - Windows: Run `ipconfig` in command prompt
   - Linux/Mac: Run `ifconfig` or `ip addr` in terminal
2. Go to **Settings** page in the frontend
3. Enter: `http://YOUR_SERVER_IP:1043` (e.g., `http://192.168.1.100:1043`)
4. Click "Test" to verify connection
5. Click "Save & Reconnect"

## Troubleshooting

### Connection Failed Error:

1. **Check if backend is running:**
   - You should see: "AFK Console Backend running on http://localhost:1043"
   - If not, run `node start.js` in the backend directory

2. **Firewall issues:**
   - Windows: Allow Node.js through Windows Firewall
   - Linux: Run `sudo ufw allow 1043`

3. **Network issues:**
   - Make sure both frontend and backend are on the same network
   - Check if you can ping the backend server

4. **Browser console:**
   - Press F12 in your browser
   - Check the Console tab for detailed error messages
   - Look for CORS errors or network errors

5. **Test with curl:**
   ```bash
   curl http://localhost:1043/api/info
   ```
   Should return JSON data if backend is working

## Features

- Multi-bot management
- Real-time chat monitoring via Socket.IO
- Anti-AFK system with configurable actions
- Auto-reconnect on disconnect
- Multi join/world change messages
- JSON persistence for settings

## CORS

The server.js includes CORS headers to allow connections from any frontend origin.

## Port Configuration

The backend uses port **1043** by default. To change it, edit the `PORT` variable in `server.js`.
