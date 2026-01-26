import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { LogEntry, getApiUrl } from '../lib/api';

// Define the structure for bot status updates
export interface BotStatusEvent {
  botName: string;
  status: 'connecting' | 'connected' | 'spawned' | 'disconnected' | 'kicked' | 'death';
  message: string;
}

// Define the structure for bot chat messages
export interface BotChatEvent {
  botName: string;
  username: string;
  message: string;
}

// Define the structure for bot health
export interface BotHealthEvent {
  botName: string;
  health: number;
  food: number;
  saturation: number;
}

// Define the structure for bot experience
export interface BotExperienceEvent {
  botName: string;
  level: number;
  points: number;
  progress: number;
}

// Define the structure for bot inventory items
export interface BotInventoryItem {
  type: number;
  count: number;
  displayName: string;
  name: string;
  slot: number;
}

export interface BotInventoryEvent {
  botName: string;
  items: BotInventoryItem[];
}

// This is a custom React hook to manage the WebSocket connection
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatusEvent>>(() => {
    try {
      const saved = localStorage.getItem('bot_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('bot_statuses', JSON.stringify(botStatuses));
  }, [botStatuses]);
  const [botHealths, setBotHealths] = useState<Record<string, BotHealthEvent>>({});
  const [botExperiences, setBotExperiences] = useState<Record<string, BotExperienceEvent>>({});
  const [botInventories, setBotInventories] = useState<Record<string, BotInventoryEvent>>({});
  const [chatMessages, setChatMessages] = useState<BotChatEvent[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastLog, setLastLog] = useState<LogEntry | null>(null);

  // This function establishes a new WebSocket connection
  const connect = useCallback(() => {
    // Disconnect any existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Get the dynamic API URL from settings and convert it to a WebSocket URL (ws://)
    const SOCKET_URL = getApiUrl().replace(/^http/, 'ws');
    console.log(`Attempting to connect to WebSocket at: ${SOCKET_URL}`)
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Use WebSocket with a polling fallback
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Successfully connected to backend WebSocket.');
      newSocket.emit('request-sync'); // Ensure we get the latest state immediately
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setBotStatuses({}); // Clear bot statuses on disconnect
      console.warn('Disconnected from backend WebSocket.');
    });

    newSocket.on('bot-status', (data: BotStatusEvent) => {
      console.log(`[SOCKET] Received bot-status for ${data.botName}: ${data.status}`);
      setBotStatuses(prev => ({ ...prev, [data.botName]: data }));
    });

    newSocket.on('bot-health', (data: BotHealthEvent) => {
      setBotHealths(prev => ({ ...prev, [data.botName]: data }));
    });

    newSocket.on('bot-experience', (data: BotExperienceEvent) => {
      setBotExperiences(prev => ({ ...prev, [data.botName]: data }));
    });

    newSocket.on('bot-inventory', (data: BotInventoryEvent) => {
      setBotInventories(prev => ({ ...prev, [data.botName]: data }));
    });

    newSocket.on('bot-chat', (data: BotChatEvent) => {
      setChatMessages(prev => {
        const newMessages = [...prev, data];
        const finalMessages = newMessages.length > 200 ? newMessages.slice(newMessages.length - 200) : newMessages;
        localStorage.setItem('chat_history', JSON.stringify(finalMessages));
        return finalMessages;
      });
    });

    newSocket.on('bot-error', (data: { botName: string, error: string }) => {
      console.error(`Bot Error [${data.botName}]: ${data.error}`);
    });

    newSocket.on('microsoft-auth', (data: { botName: string, code: string }) => {
      console.info(
        `Microsoft Authentication Needed for ${data.botName}. Go to https://www.microsoft.com/link and use the code: ${data.code}`
      );
    });

    newSocket.on('new-log', (log: LogEntry) => {
      setLastLog(log);
    });

    // Store the new socket instance in the ref
    socketRef.current = newSocket;
  }, []); // The function is memoized and does not depend on any props or state

  // Effect to connect on initial component mount
  useEffect(() => {
    connect();
    // Cleanup function to disconnect when the component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, [connect]);

  // This is the function that the UI calls to force a reconnection with the latest settings
  const reconnect = () => {
    console.log("Reconnection triggered by user.");
    connect(); // This will disconnect the old socket and create a new one with the updated URL
  };

  // --- Actions that can be called from the UI ---
  const requestSync = useCallback(() => {
    console.log('[SOCKET] Emitting request-sync');
    socketRef.current?.emit('request-sync');
  }, []);

  const connectBot = useCallback((botName: string, version: string) => {
    console.log(`[SOCKET] Emitting connect-bot for ${botName}`);
    socketRef.current?.emit('connect-bot', { botName, version });
  }, []);

  const disconnectBot = useCallback((botName: string) => {
    console.log(`[SOCKET] Emitting disconnect-bot for ${botName}`);
    socketRef.current?.emit('disconnect-bot', { botName });
  }, []);

  const sendChat = useCallback((botName: string, message: string) => {
    console.log(`[SOCKET] Emitting send-chat for ${botName}`);
    socketRef.current?.emit('send-chat', { botName, message });
  }, []);

  const sendSpam = useCallback((botName: string, message: string, delay: number, enable: boolean) => {
    console.log(`[SOCKET] Emitting send-spam for ${botName}: ${enable}`);
    socketRef.current?.emit('send-spam', { botName, message, delay, enable });
  }, []);

  const controlBot = useCallback((botName: string, action: string, option: any) => {
    console.log(`[SOCKET] Emitting control-bot for ${botName}: ${action}`);
    socketRef.current?.emit('control-bot', { botName, action, option });
  }, []);

  const clearChat = useCallback(() => setChatMessages([]), []);

  // Expose the state and action functions to the rest of the application
  return React.useMemo(() => ({
    isConnected,
    botStatuses,
    botHealths,
    botExperiences,
    botInventories,
    chatMessages,
    lastLog,
    connectBot,
    disconnectBot,
    sendChat,
    sendSpam,
    controlBot,
    clearChat,
    reconnect,
    requestSync
  }), [
    isConnected,
    botStatuses,
    botHealths,
    botExperiences,
    botInventories,
    chatMessages,
    lastLog,
    connectBot,
    disconnectBot,
    sendChat,
    sendSpam,
    controlBot,
    clearChat,
    reconnect,
    requestSync
  ]);
}
