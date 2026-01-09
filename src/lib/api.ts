function getApiUrl() {
    return localStorage.getItem('apiUrl') || 'http://localhost:1043';
}

function setApiUrl(newUrl: string) {
    localStorage.setItem('apiUrl', newUrl);
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  return response.text();
}

async function testConnection() {
    try {
        await apiFetch('/info');
        return true;
    } catch {
        return false;
    }
}

export interface ServerInfo {
  serverIP: string;
  serverPort: number;
  version: string;
  loginDelay: number;
}

export interface BotSettings {
  sneak: boolean;
  botPhysics: boolean;
  antiAFK: boolean;
  autoReconnect: boolean;
  joinMessages: boolean;
  worldChangeMessages: boolean;
  proxies: boolean;
  fakeHost: boolean;
  antiAFKInterval: number;
  antiAFKPhysical: { forward: boolean; head: boolean; arm: boolean; jump: boolean };
  antiAFKChat: { message: string; send: boolean };
  joinMessageDelay: number;
  joinMessagesList: string[];
  worldChangeMessageDelay: number;
  worldChangeMessagesList: string[];
  autoReconnectDelay: number;
}

export interface BotAccount {
  username: string;
  password?: string;
  auth: 'microsoft' | 'mojang' | 'offline';
}

export interface LogEntry {
  timestamp: string;
  type: string;
  botName?: string;
  message?: string;
  error?: string;
  status?: string;
}

export interface AntiAFKConfig {
    interval: number;
    physical: { forward: boolean; head: boolean; arm: boolean; jump: boolean };
    chat: { message: string; send: boolean };
}

export interface JoinMessagesConfig {
    delay: number;
    messages: string[];
}

export interface WorldChangeConfig {
    delay: number;
    messages: string[];
}

export interface AutoReconnectConfig {
    delay: number;
}

export interface Version {
  version: string;
}

export { getApiUrl, setApiUrl, testConnection };

export const getVersion = () => apiFetch('/version') as Promise<Version>;

export const getServerInfo = () => apiFetch('/info') as Promise<ServerInfo>;
export const saveServerInfo = (data: ServerInfo) => apiFetch('/info', { method: 'POST', body: JSON.stringify(data) });

export const getSettings = () => apiFetch('/settings') as Promise<BotSettings>;
export const saveSettings = (data: BotSettings) => apiFetch('/settings', { method: 'POST', body: JSON.stringify(data) });

export const getBots = () => apiFetch('/bots') as Promise<BotAccount[]>;
export const saveBots = (data: BotAccount[]) => apiFetch('/bots', { method: 'POST', body: JSON.stringify(data) });

export const getProxies = () => apiFetch('/proxies') as Promise<string>;
export const saveProxies = (proxies: string) => apiFetch('/proxies', { method: 'POST', body: JSON.stringify({ proxies }) });

export const getLogs = () => apiFetch('/logs') as Promise<LogEntry[]>;

export const getAntiAFKConfig = () => apiFetch('/anti-afk-config') as Promise<AntiAFKConfig>;
export const saveAntiAFKConfig = (data: AntiAFKConfig) => apiFetch('/anti-afk-config', { method: 'POST', body: JSON.stringify(data) });

export const getJoinMessagesConfig = () => apiFetch('/join-messages-config') as Promise<JoinMessagesConfig>;
export const saveJoinMessagesConfig = (data: JoinMessagesConfig) => apiFetch('/join-messages-config', { method: 'POST', body: JSON.stringify(data) });

export const getWorldChangeConfig = () => apiFetch('/world-change-messages-config') as Promise<WorldChangeConfig>;
export const saveWorldChangeConfig = (data: WorldChangeConfig) => apiFetch('/world-change-messages-config', { method: 'POST', body: JSON.stringify(data) });

export const getAutoReconnectConfig = () => apiFetch('/autoreconnect-config') as Promise<AutoReconnectConfig>;
export const saveAutoReconnectConfig = (data: AutoReconnectConfig) => apiFetch('/autoreconnect-config', { method: 'POST', body: JSON.stringify(data) });
