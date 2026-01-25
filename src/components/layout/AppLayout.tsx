import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { Home, MessageSquare, Users, ToyBrick, Cog, Rss } from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const { isConnected } = useSocketContext();

  const navLinks = [
    { to: '/', label: 'Connect', icon: Home },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: '/accounts', label: 'Accounts', icon: Users },
    { to: '/movement', label: 'Movement', icon: ToyBrick },
    { to: '/proxies', label: 'Proxies', icon: Rss },
    { to: '/settings', label: 'Settings', icon: Cog },
  ];

  return (
    <div className="h-screen flex bg-black text-foreground">
      <AppSidebar navLinks={navLinks} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <HeroBanner />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
      <div
        className={cn(
          'fixed bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium',
          'transition-colors duration-300',
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        )}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
