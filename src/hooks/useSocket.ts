import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const socket = io();

export interface BotStatusEvent {
  botName: string;
  status: string;
  message?: string;
}

export interface BotChatEvent {
  botName: string;
  message: string;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatusEvent>>({});
  const [chatMessages, setChatMessages] = useState<BotChatEvent[]>([]);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const onBotStatus = useCallback((event: BotStatusEvent) => {
    setBotStatuses((prevStatuses) => ({
      ...prevStatuses,
      [event.botName]: event,
    }));
  }, []);

  const onBotChat = useCallback((event: BotChatEvent) => {
    setChatMessages((prevMessages) => [...prevMessages, event]);
  }, []);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('botStatus', onBotStatus);
    socket.on('botChat', onBotChat);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('botStatus', onBotStatus);
      socket.off('botChat', onBotChat);
    };
  }, [onConnect, onDisconnect, onBotStatus, onBotChat]);

  const connectBot = useCallback((botName: string) => {
    socket.emit('connectBot', botName);
  }, []);

  const disconnectBot = useCallback((botName: string) => {
    socket.emit('disconnectBot', botName);
  }, []);

  const sendChat = useCallback((botName: string, message: string) => {
    socket.emit('sendChat', { botName, message });
  }, []);

  const sendSpam = useCallback((botName: string, message: string, delay: number, enable: boolean) => {
    socket.emit('sendSpam', { botName, message, delay, enable });
  }, []);

  const controlBot = useCallback((botName: string, action: string, option: any) => {
    socket.emit('controlBot', { botName, action, option });
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const reconnect = useCallback(() => {
    socket.connect();
  }, []);

  return {
    isConnected,
    botStatuses,
    chatMessages,
    connectBot,
    disconnectBot,
    sendChat,
    sendSpam,
    controlBot,
    clearChat,
    reconnect,
  };
}
