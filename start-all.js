const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes (no dependency needed)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  backend: (msg) => console.log(`${colors.blue}[BACKEND]${colors.reset} ${msg}`),
  frontend: (msg) => console.log(`${colors.magenta}[FRONTEND]${colors.reset} ${msg}`)
};

console.log(`
${colors.cyan}${colors.bright}╔══════════════════════════════════════════════════════════════╗${colors.reset}
${colors.cyan}${colors.bright}║                 Web AFK Client Launcher                      ║${colors.reset}
${colors.cyan}${colors.bright}╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = isWindows ? 'node.exe' : 'node';

let backendProcess;
let frontendProcess;
let processesStarted = 0;

function startBackend() {
  log.info('Starting Backend Server...');
  console.log(`${colors.gray}  → Location: ./backend/server.js${colors.reset}`);
  console.log(`${colors.gray}  → Port: 25582${colors.reset}\n`);

  backendProcess = spawn(nodeCmd, ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      // Check if it's the startup message
      if (line.includes('AFK Console Backend running')) {
        log.success('Backend server is running!');
        processesStarted++;
      }
      log.backend(line);
    });
  });

  backendProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      if (line.includes('DeprecationWarning') || line.includes('ExperimentalWarning')) {
        console.log(`${colors.gray}[BACKEND] ${line}${colors.reset}`);
      } else {
        log.backend(`${colors.red}${line}${colors.reset}`);
      }
    });
  });

  backendProcess.on('error', (err) => {
    log.error(`Backend error: ${err.message}`);
  });

  backendProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      log.error(`Backend process exited with code ${code}`);
    }
  });
}

function startFrontend() {
  log.info('Starting Frontend Development Server...');
  console.log(`${colors.gray}  → Command: npm run dev${colors.reset}`);
  console.log(`${colors.gray}  → Port: 8080${colors.reset}\n`);

  frontendProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: __dirname,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      // Highlight important messages
      if (line.includes('Local:') || line.includes('Network:')) {
        log.success(line);
        if (line.includes('Local:')) {
          processesStarted++;
          printSummary();
        }
      } else if (line.includes('ready') || line.includes('VITE')) {
        log.frontend(`${colors.green}${line}${colors.reset}`);
      } else {
        log.frontend(line);
      }
    });
  });

  frontendProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      log.frontend(`${colors.red}${line}${colors.reset}`);
    });
  });

  frontendProcess.on('error', (err) => {
    log.error(`Frontend error: ${err.message}`);
  });

  frontendProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      log.error(`Frontend process exited with code ${code}`);
    }
  });
}

function printSummary() {
  if (processesStarted >= 2) {
    console.log(`
${colors.green}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.green}${colors.bright}  ✓ All services are running!${colors.reset}
${colors.green}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.white}Services:${colors.reset}
  ${colors.cyan}• Backend:${colors.reset}  ${colors.green}http://localhost:25582${colors.reset}
  ${colors.cyan}• Frontend:${colors.reset} ${colors.green}http://localhost:8080${colors.reset}

${colors.gray}Press Ctrl+C to stop all services${colors.reset}
`);
  }
}

// Graceful shutdown
function shutdown() {
  console.log(`\n${colors.yellow}Shutting down services...${colors.reset}\n`);
  
  if (backendProcess) {
    log.info('Stopping backend server...');
    backendProcess.kill('SIGTERM');
  }
  
  if (frontendProcess) {
    log.info('Stopping frontend server...');
    frontendProcess.kill('SIGTERM');
  }

  setTimeout(() => {
    log.success('All services stopped. Goodbye!');
    process.exit(0);
  }, 1000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', () => {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
});

// Start both servers
startBackend();

// Wait 3 seconds before starting frontend to let backend initialize
setTimeout(() => {
  startFrontend();
}, 3000);
