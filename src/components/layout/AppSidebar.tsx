import { Link, useLocation } from 'react-router-dom';
import { 
  Plug, 
  MessageSquare, 
  Users, 
  Globe, 
  Move, 
  Settings,
  Info,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
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
    <aside className="w-56 min-h-screen bg-sidebar flex flex-col shadow-lg">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="font-bold text-xl text-center text-sidebar-primary tracking-wider">WEB AFK</h1>
        <p className="text-xs text-sidebar-foreground text-center">CLIENT</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          Web Client
        </Link>
      </div>
    </aside>
  );
}
