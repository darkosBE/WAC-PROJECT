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

// This is a custom React hook to manage the WebSocket connection
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatusEvent>>({});
  const [chatMessages, setChatMessages] = useState<BotChatEvent[]>([]);
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

    // --- Event Handlers ---
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Successfully connected to backend WebSocket.');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setBotStatuses({}); // Clear bot statuses on disconnect
      console.warn('Disconnected from backend WebSocket.');
    });

    newSocket.on('bot-status', (data: BotStatusEvent) => {
      setBotStatuses(prev => ({ ...prev, [data.botName]: data }));
    });
    
    newSocket.on('bot-chat', (data: BotChatEvent) => {
      setChatMessages(prev => [...prev, data]);
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
  // Modified connectBot to include the 'version' parameter
  const connectBot = (botName: string, version: string) => socketRef.current?.emit('connect-bot', { botName, version });
  const disconnectBot = (botName: string) => socketRef.current?.emit('disconnect-bot', { botName });
  const sendChat = (botName: string, message: string) => socketRef.current?.emit('send-chat', { botName, message });
  const sendSpam = (botName: string, message: string, delay: number, enable: boolean) => socketRef.current?.emit('send-spam', { botName, message, delay, enable });
  const controlBot = (botName: string, action: string, option: any) => socketRef.current?.emit('control-bot', { botName, action, option });
  const clearChat = () => setChatMessages([]);

  // Expose the state and action functions to the rest of the application
  return { isConnected, botStatuses, chatMessages, lastLog, connectBot, disconnectBot, sendChat, sendSpam, controlBot, clearChat, reconnect };
}
