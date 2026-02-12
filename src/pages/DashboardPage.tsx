import * as React from 'react';
import { useSocketContext } from '@/contexts/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Boxes, Heart, Utensils, Zap, Activity, LayoutGrid, Award, 
  PackageSearch, Signal, Power, RefreshCw, Bot, ChevronRight
} from 'lucide-react';
import { BotInventoryItem, BotStatusEvent } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

// --- SUB-COMPONENTS (MEMOIZED) ---

/**
 * Renders the Minecraft inventory grid (9x6 approximately)
 */
const InventoryGrid = React.memo(({ inventory }: { inventory: BotInventoryItem[] }) => {
  const slots = React.useMemo(() => {
    return Array.from({ length: 46 }).map((_, i) => {
      return inventory.find(item => item.slot === i);
    });
  }, [inventory]);

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-9 gap-1">
        {slots.map((item, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded border flex items-center justify-center relative group transition-all duration-150",
              item
                ? "inventory-slot-filled"
                : "inventory-slot"
            )}
            title={item ? `${item.displayName} (x${item.count})` : `Slot ${i}`}
          >
            {item ? (
              <div className="flex flex-col items-center justify-center p-0.5 w-full h-full">
                <div className="text-[8px] sm:text-[9px] text-center font-medium line-clamp-2 leading-tight select-none text-foreground">
                  {item.displayName}
                </div>
                {item.count > 1 && (
                  <div className="absolute bottom-0.5 right-0.5 text-[9px] font-bold text-primary select-none">
                    {item.count}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[7px] opacity-20 select-none font-mono">{i}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-muted border border-border">
        <PackageSearch className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          Hotbar: Slots 36 - 44
        </p>
      </div>
    </div>
  );
});

InventoryGrid.displayName = 'InventoryGrid';

/**
 * Individual Bot Stat Card - Clean Design
 */
interface BotStatCardProps {
  botName: string;
  status: string;
  health: { health: number; food: number; saturation: number };
  xp: { level: number; points: number; progress: number };
  inventory: BotInventoryItem[];
  onDisconnect: (name: string) => void;
}

const BotStatCard = React.memo(({ botName, status, health, xp, inventory, onDisconnect }: BotStatCardProps) => {
  const getBadgeStyles = (s: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, colorClass: string }> = {
      'spawned': { variant: "default", label: "ACTIVE", colorClass: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-300 dark:border-green-500/30" },
      'connected': { variant: "default", label: "ONLINE", colorClass: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-300 dark:border-green-500/30" },
      'connecting': { variant: "secondary", label: "CONNECTING", colorClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30" },
      'death': { variant: "destructive", label: "DIED", colorClass: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-300 dark:border-red-500/30" },
      'kicked': { variant: "destructive", label: "KICKED", colorClass: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-300 dark:border-red-500/30" },
      'disconnected': { variant: "outline", label: "OFFLINE", colorClass: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-300 dark:border-gray-500/30" }
    };
    return statusMap[s] || { variant: "secondary", label: s.toUpperCase(), colorClass: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400" };
  };

  const badgeConfig = getBadgeStyles(status);
  const isOnline = status === 'spawned' || status === 'connected';

  return (
    <Card className="bot-card">
      <CardHeader className="bot-card-header">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 border",
            isOnline 
              ? "bg-green-100 border-green-300 dark:bg-green-500/20 dark:border-green-500/30"
              : "bg-muted border-border"
          )}>
            <Bot className={cn("w-5 h-5", isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
          </div>
          <div>
            <CardTitle className="text-sm font-bold tracking-tight truncate max-w-[140px] text-foreground">
              {botName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", 
                isOnline ? "bg-green-500" : "bg-gray-400"
              )} />
              <span className={cn("text-[10px] font-medium uppercase", 
                isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
              )}>
                {badgeConfig.label}
              </span>
            </div>
          </div>
        </div>
        <Badge variant={badgeConfig.variant} className={cn("text-[10px] font-bold px-2 py-0.5 border", badgeConfig.colorClass)}>
          {badgeConfig.label}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Stats Section - Clean */}
        <div className="grid gap-3">
          {/* Health Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <Heart className="w-3 h-3" />
                <span>Health</span>
              </div>
              <span className="text-muted-foreground font-mono">{Math.round(health.health || 0)} / 20</span>
            </div>
            <Progress value={((health.health || 0) / 20) * 100} className="h-1.5" />
          </div>

          {/* Food Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                <Utensils className="w-3 h-3" />
                <span>Food</span>
              </div>
              <span className="text-muted-foreground font-mono">{Math.round(health.food || 0)} / 20</span>
            </div>
            <Progress value={((health.food || 0) / 20) * 100} className="h-1.5" />
          </div>

          {/* Experience Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <Zap className="w-3 h-3" />
                <span>Level {xp.level || 0}</span>
              </div>
              <span className="text-muted-foreground font-mono">{Math.round((xp.progress || 0) * 100)}%</span>
            </div>
            <Progress value={(xp.progress || 0) * 100} className="h-1.5" />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {/* Inventory Action */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[10px] font-bold h-8 uppercase tracking-wider border-border hover:border-primary hover:bg-primary/5"
              >
                <Boxes className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Manage ({inventory?.length || 0})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6 border-border bg-card">
              <DialogHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <Boxes className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-foreground">{botName}</DialogTitle>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Physical Inventory Core</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-auto scrollbar-thin pr-1">
                <InventoryGrid inventory={inventory} />
              </div>
            </DialogContent>
          </Dialog>

          {/* Disconnect Action */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm(`Are you sure you want ${botName} to leave?`)) {
                onDisconnect(botName);
              }
            }}
            className="text-[10px] font-bold h-8 uppercase tracking-wider bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/30"
          >
            <Power className="w-3.5 h-3.5 mr-1" />
            Leave
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

BotStatCard.displayName = 'BotStatCard';

// --- MAIN PAGE COMPONENT ---

export default function DashboardPage() {
  const { botStatuses, botHealths, botExperiences, botInventories, disconnectBot } = useSocketContext();

  const connectedBotsList = React.useMemo(() => {
    return (Object.entries(botStatuses) as [string, BotStatusEvent][]).filter(([, status]) =>
      status.status === 'connected' || status.status === 'spawned' || status.status === 'death'
    );
  }, [botStatuses]);

  const analytics = React.useMemo(() => {
    if (connectedBotsList.length === 0) return { avgHealth: 0, maxLevel: 0, totalItems: 0 };

    const totalHealth = connectedBotsList.reduce((acc, [name]) => acc + (botHealths[name]?.health || 0), 0);
    const maxLvl = Math.max(0, ...connectedBotsList.map(([name]) => botExperiences[name]?.level || 0));
    const totalItemsCount = connectedBotsList.reduce((acc, [name]) => acc + (botInventories[name]?.items?.length || 0), 0);

    return {
      avgHealth: Math.round(totalHealth / connectedBotsList.length),
      maxLevel: maxLvl,
      totalItems: totalItemsCount
    };
  }, [connectedBotsList, botHealths, botExperiences, botInventories]);

  return (
    <div className="h-full flex flex-col space-y-6 pb-8">
      {/* Page Header - Clean */}
      <div className="flex flex-col gap-1 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Command Center
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg">
          Real-time bot orchestration and biometrics. Monitor all your connected bots in one place.
        </p>
      </div>

      {connectedBotsList.length === 0 ? (
        <div className="flex-1 flex items-center justify-center animate-scale-in">
          <Card className="border-dashed border-border bg-card/50 w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12 px-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xl text-foreground">System Idle</h3>
                <p className="text-sm text-muted-foreground">
                  No bots are currently deployed. Go to{" "}
                  <span className="text-primary font-semibold cursor-pointer hover:underline">Connection</span>{" "}
                  to start.
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Signal className="w-4 h-4 mr-2" />
                Go to Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Global Analytics Section - Clean */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            {/* Total Bots */}
            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Bots</p>
                    <p className="text-3xl font-bold text-foreground leading-none">{connectedBotsList.length}</p>
                  </div>
                  <div className="stats-card-icon">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Status */}
            <Card className="stats-card border-red-200 dark:border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Health</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 leading-none">{analytics.avgHealth}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Max Level */}
            <Card className="stats-card border-green-200 dark:border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Max Power</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 leading-none">L{analytics.maxLevel}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Count */}
            <Card className="stats-card border-orange-200 dark:border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inventory</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 leading-none">{analytics.totalItems}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Bots Grid Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Deployed Units
                </h2>
                <div className="h-px w-20 bg-border" />
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8">
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {connectedBotsList.map(([botName, status]) => (
                <BotStatCard
                  key={botName}
                  botName={botName}
                  status={status.status}
                  health={botHealths[botName] || { health: 0, food: 0, saturation: 0 }}
                  xp={botExperiences[botName] || { level: 0, points: 0, progress: 0 }}
                  inventory={botInventories[botName]?.items || []}
                  onDisconnect={disconnectBot}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
