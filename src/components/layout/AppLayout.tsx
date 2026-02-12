import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { useSocketContext } from '@/contexts/SocketContext';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  const { isConnected, botStatuses } = useSocketContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate active bots count
  const activeBotsCount = Object.values(botStatuses).filter(
    (status: any) => status.status === 'connected' || status.status === 'spawned'
  ).length;

  return (
    <div className={cn(
      "h-screen flex bg-background text-foreground overflow-hidden",
      mounted && "animate-fade-in"
    )}>
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle Background */}
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin relative z-10">
          <div className={cn(
            "p-6 min-h-full",
            "transition-all duration-300",
            mounted && "animate-slide-up"
          )}>
            <Outlet />
          </div>
        </main>

        {/* Floating Status Indicator - Clean */}
        <div className="fixed bottom-4 left-72 z-50 flex items-center gap-3">
          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium",
            "border transition-all duration-200",
            isConnected 
              ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
              : "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>

          {/* Active Bots Counter */}
          {activeBotsCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/30">
              <Activity className="w-3 h-3" />
              <span>{activeBotsCount} Active Bot{activeBotsCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Version Badge */}
        <div className="fixed bottom-4 right-4 z-50 text-[10px] text-muted-foreground font-mono-code">
          v26.2.1
        </div>
      </div>
    </div>
  );
}
