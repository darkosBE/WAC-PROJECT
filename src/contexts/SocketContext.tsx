import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket, BotStatusEvent, BotChatEvent } from '@/hooks/useSocket.tsx';

interface SocketContextType {
  isConnected: boolean;
  botStatuses: Record<string, BotStatusEvent>;
  chatMessages: BotChatEvent[];
  connectBot: (botName: string) => void;
  disconnectBot: (botName: string) => void;
  sendChat: (botName: string, message: string) => void;
  sendSpam: (botName: string, message: string, delay: number, enable: boolean) => void;
  controlBot: (botName: string, action: string, option: any) => void;
  clearChat: () => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}
