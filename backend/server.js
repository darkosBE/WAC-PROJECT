const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mineflayer = require('mineflayer');
const fs = require('fs').promises;
const path = require('path');
const ProxyAgent = require('proxy-agent');

const app = express();
const server = http.createServer(app);

// Socket.IO with CORS enabled for frontend
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 1043;

// Store active bots and their timers
const activeBots = new Map();
const botTimers = new Map();

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const INFO_FILE = path.join(DATA_DIR, 'info.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const BOTS_FILE = path.join(DATA_DIR, 'bots.json');
const PROXIES_FILE = path.join(DATA_DIR, 'proxies.txt');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const VERSION_FILE = path.join(DATA_DIR, 'version.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Load or create default files
async function loadOrCreateFile(filePath, defaultData) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    if (filePath.endsWith('.json')) {
        return JSON.parse(data);
    }
    return data;
  } catch (err) {
      const data = filePath.endsWith('.json') ? JSON.stringify(defaultData, null, 2) : defaultData;
    await fs.writeFile(filePath, data);
    return defaultData;
  }
}

// Save data to file
async function saveFile(filePath, data) {
  const dataToSave = filePath.endsWith('.json') ? JSON.stringify(data, null, 2) : data;
  await fs.writeFile(filePath, dataToSave);
}

// MIGRATION HELPER
async function migrateSettingsIfNecessary(settings, save = false) {
  let needsSave = false;

  if (typeof settings.joinMessageText === 'string' && !Array.isArray(settings.joinMessagesList)) {
    settings.joinMessagesList = [settings.joinMessageText];
    delete settings.joinMessageText;
    needsSave = true;
  }
  if (!Array.isArray(settings.joinMessagesList)) {
    settings.joinMessagesList = ['Hello world'];
    needsSave = true;
  }

  if (typeof settings.worldChangeMessageText === 'string' && !Array.isArray(settings.worldChangeMessagesList)) {
    settings.worldChangeMessagesList = [settings.worldChangeMessageText];
    delete settings.worldChangeMessageText;
    needsSave = true;
  }
  if (!Array.isArray(settings.worldChangeMessagesList)) {
    settings.worldChangeMessagesList = ['/home'];
    needsSave = true;
  }

  if (needsSave && save) {
    await saveFile(SETTINGS_FILE, settings);
  }

  return settings;
}

async function migrateBotsIfNecessary(bots, save = false) {
  let needsSave = false;
  bots.forEach(bot => {
    if (!bot.auth) {
      bot.auth = 'microsoft'; // Default to microsoft for existing bots
      needsSave = true;
    }
  });

  if (needsSave && save) {
    await saveFile(BOTS_FILE, bots);
  }
  return bots;
}

// Initialize default data
async function initializeData() {
  await ensureDataDir();
  
  const defaultInfo = {
    serverIP: 'localhost',
    serverPort: 25565,
    version: '1.20.1',
    loginDelay: 5
  };
  
  const defaultSettings = {
    sneak: false,
    botPhysics: true,
    antiAFK: true,
    antiAFKInterval: 1,
    antiAFKPhysical: { forward: true, head: true, arm: false, jump: true },
    antiAFKChat: { message: '/ping', send: false },
    joinMessages: true,
    joinMessageDelay: 2,
    worldChangeMessages: true,
    worldChangeMessageDelay: 5,
    autoReconnect: true,
    autoReconnectDelay: 4,
    proxies: false,
    fakeHost: false
  };
  
  const defaultBots = [];
  const defaultLogs = [];
  const defaultVersion = { version: '1.0.0' };
  
  const info = await loadOrCreateFile(INFO_FILE, defaultInfo);
  let settings = await loadOrCreateFile(SETTINGS_FILE, defaultSettings);
  let bots = await loadOrCreateFile(BOTS_FILE, defaultBots);
  await loadOrCreateFile(PROXIES_FILE, '');
  await loadOrCreateFile(LOGS_FILE, defaultLogs);
  await loadOrCreateFile(VERSION_FILE, defaultVersion);
  
  settings = await migrateSettingsIfNecessary(settings, true);
  bots = await migrateBotsIfNecessary(bots, true);
  
  return { info, settings, bots };
}

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// API Routes
app.get('/api/info', async (req, res) => {
  try {
    const info = await loadOrCreateFile(INFO_FILE, {});
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/info', async (req, res) => {
  try {
    await saveFile(INFO_FILE, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings = await migrateSettingsIfNecessary(settings, true);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    await saveFile(SETTINGS_FILE, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bots', async (req, res) => {
  try {
    let bots = await loadOrCreateFile(BOTS_FILE, []);
    bots = await migrateBotsIfNecessary(bots, true);
    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bots', async (req, res) => {
  try {
    await saveFile(BOTS_FILE, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/proxies', async (req, res) => {
    try {
        const proxies = await loadOrCreateFile(PROXIES_FILE, '');
        res.send(proxies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/proxies', async (req, res) => {
    try {
        await saveFile(PROXIES_FILE, req.body.proxies);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/version', async (req, res) => {
  try {
    const version = await loadOrCreateFile(VERSION_FILE, { version: "1.0.0" });
    res.json(version);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await loadOrCreateFile(LOGS_FILE, []);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modal Config APIs
app.get('/api/anti-afk-config', async (req, res) => {
  try {
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    res.json({
      interval: settings.antiAFKInterval || 1,
      physical: settings.antiAFKPhysical || { forward: true, head: true, arm: false, jump: true },
      chat: settings.antiAFKChat || { message: '/ping', send: false }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/anti-afk-config', async (req, res) => {
  try {
    const { interval, physical, chat } = req.body;
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings.antiAFKInterval = interval;
    settings.antiAFKPhysical = physical;
    settings.antiAFKChat = chat;
    await saveFile(SETTINGS_FILE, settings);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/join-messages-config', async (req, res) => {
  try {
    let settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings = await migrateSettingsIfNecessary(settings, true);
    res.json({
      delay: settings.joinMessageDelay || 2,
      messages: settings.joinMessagesList || ['Hello world']
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/join-messages-config', async (req, res) => {
  try {
    const { delay, messages } = req.body;
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings.joinMessageDelay = delay;
    settings.joinMessagesList = (messages || []).map(m => (m || '').trim()).filter(m => m !== '');
    delete settings.joinMessageText;
    await saveFile(SETTINGS_FILE, settings);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/world-change-messages-config', async (req, res) => {
  try {
    let settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings = await migrateSettingsIfNecessary(settings, true);
    res.json({
      delay: settings.worldChangeMessageDelay || 5,
      messages: settings.worldChangeMessagesList || ['/home']
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/world-change-messages-config', async (req, res) => {
  try {
    const { delay, messages } = req.body;
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings.worldChangeMessageDelay = delay;
    settings.worldChangeMessagesList = (messages || []).map(m => (m || '').trim()).filter(m => m !== '');
    delete settings.worldChangeMessageText;
    await saveFile(SETTINGS_FILE, settings);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/autoreconnect-config', async (req, res) => {
  try {
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    res.json({ delay: settings.autoReconnectDelay || 4 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/autoreconnect-config', async (req, res) => {
  try {
    const { delay } = req.body;
    const settings = await loadOrCreateFile(SETTINGS_FILE, {});
    settings.autoReconnectDelay = delay;
    await saveFile(SETTINGS_FILE, settings);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logging function
async function logEvent(event) {
  const logs = await loadOrCreateFile(LOGS_FILE, []);
  const newLog = { ...event, timestamp: new Date().toISOString() };
  logs.push(newLog);
  await saveFile(LOGS_FILE, logs);
  io.emit('new-log', newLog);
}

// Bot cleanup & Anti-AFK setup functions
function cleanupBot(botName) {
  const timers = botTimers.get(botName);
  if (timers) {
    if (timers.antiAFK) clearInterval(timers.antiAFK);
    if (timers.spam) clearInterval(timers.spam);
    if (timers.reconnect) clearTimeout(timers.reconnect);
    botTimers.delete(botName);
  }
}

function setupAntiAFK(bot, botName, settings) {
  if (!settings.antiAFK) return;

  const config = {
    physical: settings.antiAFKPhysical || { forward: true, head: true, arm: false, jump: true },
    chat: settings.antiAFKChat || { message: '/ping', send: false }
  };

  const timer = setInterval(() => {
    if (!activeBots.has(botName) || !bot || bot._client.ended) {
      clearInterval(timer);
      return;
    }

    try {
      if (config.physical.forward) {
        bot.setControlState('forward', true);
        setTimeout(() => bot && !bot._client.ended && bot.setControlState('forward', false), 500);
      }
      if (config.physical.jump) {
        bot.setControlState('jump', true);
        setTimeout(() => bot && !bot._client.ended && bot.setControlState('jump', false), 500);
      }
      if (config.physical.head) {
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
      }
      if (config.physical.arm) bot.swingArm();
      if (config.chat.send && config.chat.message) bot.chat(config.chat.message);
    } catch (err) {
      console.error(`Anti-AFK error for ${botName}:`, err);
    }
  }, (settings.antiAFKInterval || 1) * 60 * 1000);

  const timers = botTimers.get(botName) || {};
  timers.antiAFK = timer;
  botTimers.set(botName, timers);
}

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('connect-bot', async (data) => {
    const { botName, version } = data;
    
    try {
      if (activeBots.has(botName)) {
        const error = { botName, error: 'Bot already connected' };
        socket.emit('bot-error', error);
        logEvent({ type: 'bot-error', ...error });
        return;
      }

      const info = await loadOrCreateFile(INFO_FILE, {});
      let settings = await loadOrCreateFile(SETTINGS_FILE, {});
      settings = await migrateSettingsIfNecessary(settings, true);
      let bots = await loadOrCreateFile(BOTS_FILE, []);
      bots = await migrateBotsIfNecessary(bots, true);
      
      const botData = bots.find(b => b.username === botName);
      if (!botData) {
        const error = { botName, error: 'Bot not found' };
        socket.emit('bot-error', error);
        logEvent({ type: 'bot-error', ...error });
        return;
      }
      
      const status = { botName, status: 'connecting', message: 'Connecting...' };
      socket.emit('bot-status', status);
      logEvent({ type: 'bot-status', ...status });
      
      await new Promise(resolve => setTimeout(resolve, info.loginDelay * 1000));
      
      const botOptions = {
        host: info.serverIP,
        port: info.serverPort || 25565,
        username: botData.username,
        version: version || info.version || '1.20.1',
        auth: botData.auth || 'microsoft',
        physicsEnabled: settings.botPhysics !== false,
        disableChatSigning: true
      };

      if (settings.proxies) {
        const proxies = await loadOrCreateFile(PROXIES_FILE, '');
        const proxyList = proxies.split('\n').filter(p => p.trim() !== '');
        if (proxyList.length > 0) {
            const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
            const [host, port, username, password] = proxy.split(':');
            botOptions.agent = new ProxyAgent({ protocol: 'http', host, port, auth: username && password ? `${username}:${password}` : undefined });
        }
      }
      
      if (botOptions.auth === 'microsoft' && botData.password) {
        botOptions.password = botData.password;
      }
      
      const bot = mineflayer.createBot(botOptions);
      activeBots.set(botName, bot);
      botTimers.set(botName, {});
      
      bot.on('login', () => {
        const status = { botName, status: 'connected', message: 'Connected' };
        socket.emit('bot-status', status);
        logEvent({ type: 'bot-status', ...status });
        
        if (settings.joinMessages && Array.isArray(settings.joinMessagesList)) {
          setTimeout(() => {
            if (bot && !bot._client.ended) {
              settings.joinMessagesList.forEach((msg, i) => {
                if (!msg.trim()) return;
                setTimeout(() => bot && !bot._client.ended && bot.chat(msg.trim()), i * 300);
              });
            }
          }, (settings.joinMessageDelay || 2) * 1000);
        }
        
        if (settings.sneak) {
          setTimeout(() => bot && !bot._client.ended && bot.setControlState('sneak', true), 500);
        }
      });
      
      bot.on('spawn', () => {
        const status = { botName, status: 'spawned', message: 'Spawned' };
        socket.emit('bot-status', status);
        logEvent({ type: 'bot-status', ...status });
        
        if (settings.worldChangeMessages && Array.isArray(settings.worldChangeMessagesList)) {
          setTimeout(() => {
            if (bot && !bot._client.ended) {
              settings.worldChangeMessagesList.forEach((msg, i) => {
                if (!msg.trim()) return;
                setTimeout(() => bot && !bot._client.ended && bot.chat(msg.trim()), i * 300);
              });
            }
          }, (settings.worldChangeMessageDelay || 5) * 1000);
        }
        
        setupAntiAFK(bot, botName, settings);
      });
      
      bot.on('message', (jsonMsg) => {
        const chat = { botName, username: 'Server', message: jsonMsg.toString() };
        socket.emit('bot-chat', chat);
        logEvent({ type: 'bot-chat', ...chat });
      });
      
      bot.on('chat', (username, message) => {
        const chat = { botName, username, message };
        socket.emit('bot-chat', chat);
        logEvent({ type: 'bot-chat', ...chat });
      });
      
      bot.on('error', (err) => {
        const message = err.message || '';
        if (message.includes('https://www.microsoft.com/link')) {
          const codeMatch = message.match(/use the code ([A-Z0-9]+)/);
          const authEvent = { 
            botName, 
            code: codeMatch ? codeMatch[1] : 'N/A',
            message: message 
          };
          socket.emit('microsoft-auth', authEvent);
          logEvent({ type: 'microsoft-auth', ...authEvent });
        } else {
          const error = { botName, error: message };
          socket.emit('bot-error', error);
          logEvent({ type: 'bot-error', ...error });
        }
      });
      
      bot.on('end', (reason) => {
        const status = { botName, status: 'disconnected', message: `Disconnected: ${reason || 'Unknown'}` };
        socket.emit('bot-status', status);
        logEvent({ type: 'bot-status', ...status });
        cleanupBot(botName);
        activeBots.delete(botName);
        
        if (settings.autoReconnect) {
          const timer = setTimeout(() => {
            const reconnectEvent = { botName };
            socket.emit('reconnecting-bot', reconnectEvent);
            logEvent({ type: 'reconnecting-bot', ...reconnectEvent });
            socket.emit('connect-bot', { botName, version: botOptions.version });
          }, (settings.autoReconnectDelay || 4) * 1000);
          botTimers.set(botName, { reconnect: timer });
        }
      });
      
      bot.on('kicked', (reason) => {
        const status = { botName, status: 'kicked', message: `Kicked: ${reason}` };
        socket.emit('bot-status', status);
        logEvent({ type: 'bot-status', ...status });
      });
      bot.on('death', () => {
        const status = { botName, status: 'death', message: 'Died and respawned' };
        socket.emit('bot-status', status);
        logEvent({ type: 'bot-status', ...status });
      });
      
    } catch (err) {
      const error = { botName, error: err.message };
      socket.emit('bot-error', error);
      logEvent({ type: 'bot-error', ...error });
      cleanupBot(botName);
      activeBots.delete(botName);
    }
  });
  
  socket.on('disconnect-bot', (data) => {
    const { botName } = data;
    const bot = activeBots.get(botName);
    if (bot) {
      try { bot.quit(); } catch (err) {}
      cleanupBot(botName);
      activeBots.delete(botName);
      const status = { botName, status: 'disconnected', message: 'Disconnected' };
      socket.emit('bot-status', status);
      logEvent({ type: 'bot-status', ...status });
    }
  });
  
  socket.on('send-chat', (data) => {
    const { botName, message } = data;
    const bot = activeBots.get(botName);
    if (bot && !bot._client.ended) {
      try { bot.chat(message); } catch (err) {}
    }
  });
  
  socket.on('send-spam', (data) => {
    const { botName, message, delay, enable } = data;
    const bot = activeBots.get(botName);
    const timers = botTimers.get(botName);
    if (!bot || !timers) return;
    
    if (timers.spam) {
      clearInterval(timers.spam);
      timers.spam = null;
    }
    
    if (enable && message) {
      timers.spam = setInterval(() => {
        if (!activeBots.has(botName) || !bot || bot._client.ended) {
          clearInterval(timers.spam);
          return;
        }
        try { bot.chat(message); } catch (err) {}
      }, (delay || 20) * 1000);
    }
  });

  socket.on('control-bot', (data) => {
    const { botName, action, option } = data;
    const bot = activeBots.get(botName);
    if (!bot || bot._client.ended) return;

    try {
      switch (action) {
        case 'move':
          ['forward', 'back', 'left', 'right', 'jump', 'sprint', 'sneak'].forEach(control => {
            bot.setControlState(control, control === option);
          });
          if (option === 'stop') {
            ['forward', 'back', 'left', 'right', 'jump', 'sprint', 'sneak'].forEach(control => {
              bot.setControlState(control, false);
            });
          }
          break;
        case 'jump':
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
          break;
        case 'look':
          const { yaw, pitch } = option || {};
          bot.look(yaw, pitch);
          break;
        case 'swing':
          bot.swingArm();
          break;
      }
    } catch(e) {
      console.log(e)
    }
  });
  
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  for (const [botName, bot] of activeBots.entries()) {
    try { bot.quit(); cleanupBot(botName); } catch (err) {}
  }
  process.exit(0);
});

async function startServer() {
  await initializeData();
  server.listen(PORT, () => {
    console.log(`AFK Console Backend running on http://localhost:${PORT}`);
  });
}

startServer();
