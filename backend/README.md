# AFK Console - Backend

This service handles Minecraft bot connections and state management using Mineflayer and Socket.IO.

## Setup

```bash
npm install
npm start
```

Runs on port **25582** by default.

## Configuration

Data is stored in the `data/` directory (created on first run):
- `settings.json`: Global configuration (Anti-AFK, reconnect delays).
- `bots.json`: Saved bot credentials.
- `proxies.txt`: List of proxies for bot rotation.

## API Reference

The backend exposes a REST API for configuration and a Socket.IO namespace for real-time bot control.

### HTTP Endpoints
- `GET /api/info` - Server version/IP info
- `GET /api/settings` - Global settings
- `GET /api/bots` - List of saved bots
- `GET /api/proxies` - List of proxies

### Socket.IO Events
- `connect-bot`: Request to connect a specific bot.
- `disconnect-bot`: Request to disconnect a bot.
- `control-bot`: Send movement/action commands (WASD, jump, etc).
