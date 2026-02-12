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
  LayoutDashboard,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Stats' },
  { path: '/', label: 'Connection', icon: Plug, description: 'Manage Bots' },
  { path: '/chat', label: 'Chat', icon: MessageSquare, description: 'Live Chat' },
  { path: '/accounts', label: 'Accounts', icon: Users, description: 'Bot Accounts' },
  { path: '/proxies', label: 'Proxies', icon: Globe, description: 'Proxy Settings' },
  { path: '/movement', label: 'Movement', icon: Move, description: 'Bot Controls' },
  { path: '/settings', label: 'Settings', icon: Settings, description: 'Configuration' },
  { path: '/credits', label: 'Credits', icon: Info, description: 'About' },
];

export function AppSidebar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo Section - Clean */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-foreground tracking-wide">WEB AFK CLIENT</h1>
            <p className="text-[10px] text-muted-foreground">v26.2.1</p>
          </div>
        </div>
      </div>

      {/* Navigation - Clean */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Main Menu
        </div>
        
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isHovered = hoveredItem === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 mb-0.5",
                isActive
                  ? "nav-item-active"
                  : "nav-item"
              )}
            >
              {/* Icon Container - Clean */}
              <div className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isHovered && !isActive && "scale-110"
                )} />
              </div>
              
              {/* Label */}
              <div className="flex-1">
                <span className={cn(
                  "font-medium text-sm transition-colors duration-200",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {item.label}
                </span>
              </div>
              
              {/* Arrow for Active */}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary" />
              )}
            </Link>
          );
        })}

        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6 px-3">
          Configuration
        </div>
        
        {navItems.slice(4).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isHovered = hoveredItem === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 mb-0.5",
                isActive
                  ? "nav-item-active"
                  : "nav-item"
              )}
            >
              {/* Icon Container - Clean */}
              <div className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isHovered && !isActive && "scale-110"
                )} />
              </div>
              
              {/* Label */}
              <div className="flex-1">
                <span className={cn(
                  "font-medium text-sm transition-colors duration-200",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {item.label}
                </span>
              </div>
              
              {/* Arrow for Active */}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section - Clean */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-green-100 dark:bg-green-500/20 flex items-center justify-center border border-green-300 dark:border-green-500/30">
              <Terminal className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Web Client</p>
              <p className="text-[10px] text-muted-foreground">Ready</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
