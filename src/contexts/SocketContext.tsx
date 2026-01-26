import { createContext, useContext, ReactNode } from 'react';
import {
  useSocket,
  BotStatusEvent,
  BotChatEvent,
  BotHealthEvent,
  BotExperienceEvent,
  BotInventoryEvent
} from '../hooks/useSocket';
import { LogEntry } from '../lib/api';

// Define the shape of the context
// This is what the rest of the application will interact with.
interface SocketContextType {
  isConnected: boolean;
  botStatuses: Record<string, BotStatusEvent>;
  botHealths: Record<string, BotHealthEvent>;
  botExperiences: Record<string, BotExperienceEvent>;
  botInventories: Record<string, BotInventoryEvent>;
  chatMessages: BotChatEvent[];
  lastLog: LogEntry | null;
  connectBot: (botName: string, version: string) => void;
  disconnectBot: (botName: string) => void;
  sendChat: (botName: string, message: string) => void;
  sendSpam: (botName: string, message: string, delay: number, enable: boolean) => void;
  controlBot: (botName: string, action: string, option: any) => void;
  clearChat: () => void;
  reconnect: () => void;
}

// Create the context with a default (empty) value.
export const SocketContext = createContext<SocketContextType>(null!);

// --- SocketProvider Component ---
// This is the component that will wrap the application and provide the context.
interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socket = useSocket(); // This hook contains all the connection logic

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook for easy access to the socket context
export function useSocketContext() {
  return useContext(SocketContext);
}
