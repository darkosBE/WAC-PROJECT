import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { LogEntry } from '@/lib/api';

const SOCKET_URL = 'http://localhost:1043';

export interface BotStatusEvent {
  botName: string;
  status: 'connecting' | 'connected' | 'spawned' | 'disconnected' | 'kicked' | 'death';
  message: string;
}

export interface BotChatEvent {
  botName: string;
  username: string;
  message: string;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatusEvent>>({});
  const [chatMessages, setChatMessages] = useState<BotChatEvent[]>([]);
  const [lastLog, setLastLog] = useState<LogEntry | null>(null);

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  };
  
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'] 
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to backend');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      toast.warning('Disconnected from backend');
    });

    socket.on('bot-status', (data: BotStatusEvent) => {
      setBotStatuses(prev => ({ ...prev, [data.botName]: data }));
    });
    
    socket.on('bot-chat', (data: BotChatEvent) => {
      setChatMessages(prev => [...prev, data]);
    });
    
    socket.on('bot-error', (data: { botName: string, error: string }) => {
      toast.error(`Bot ${data.botName}: ${data.error}`);
    });

    socket.on('microsoft-auth', (data: { botName: string, code: string }) => {
      toast.info(
        <div>
          <p className="font-bold">Microsoft Authentication Needed for {data.botName}</p>
          <p>Go to <a href="https://www.microsoft.com/link" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">https://www.microsoft.com/link</a> and use the code: <strong className="text-lg">{data.code}</strong></p>
        </div>, 
        { duration: 30000 }
      );
    });
    
    socket.on('new-log', (log: LogEntry) => {
      setLastLog(log);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connectBot = (botName: string) => socketRef.current?.emit('connect-bot', { botName });
  const disconnectBot = (botName: string) => socketRef.current?.emit('disconnect-bot', { botName });
  const sendChat = (botName: string, message: string) => socketRef.current?.emit('send-chat', { botName, message });
  const sendSpam = (botName: string, message: string, delay: number, enable: boolean) => socketRef.current?.emit('send-spam', { botName, message, delay, enable });
  const controlBot = (botName: string, action: string, option: any) => socketRef.current?.emit('control-bot', { botName, action, option });
  const clearChat = () => setChatMessages([]);

  return { isConnected, botStatuses, chatMessages, lastLog, connectBot, disconnectBot, sendChat, sendSpam, controlBot, clearChat, reconnect };
}
