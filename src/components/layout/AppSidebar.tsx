import { Link, useLocation } from 'react-router-dom';
import {
  Plug,
  MessageSquare,
  Users,
  Globe,
  Move,
  Settings,
  Info,
  Terminal,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/', label: 'Connection', icon: Plug },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/accounts', label: 'Accounts', icon: Users },
  { path: '/proxies', label: 'Proxies', icon: Globe },
  { path: '/movement', label: 'Movement', icon: Move },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/credits', label: 'Credits', icon: Info },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="font-bold text-sm text-muted-foreground tracking-widest">WEB AFK CLIENT</h1>
      </div>


      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>


      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-muted/30">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Web Client</span>
        </div>
      </div>
    </aside>
  );
}
