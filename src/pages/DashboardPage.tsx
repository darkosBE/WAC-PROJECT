import * as React from 'react';
import { useSocketContext } from '@/contexts/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Boxes, Heart, Utensils, Zap, AlertCircle, Activity, LayoutGrid, Award, PackageSearch } from 'lucide-react';
import { BotInventoryItem, BotStatusEvent } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

// --- SUB-COMPONENTS (MEMOIZED) ---

/**
 * Renders the Minecraft inventory grid (9x6 approximately)
 */
const InventoryGrid = React.memo(({ inventory }: { inventory: BotInventoryItem[] }) => {
    const slots = React.useMemo(() => {
        // Standard Minecraft inventory slots: 0-45
        return Array.from({ length: 46 }).map((_, i) => {
            return inventory.find(item => item.slot === i);
        });
    }, [inventory]);

    return (
        <div className="mt-4 space-y-4">
            <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                {slots.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "aspect-square rounded-md border flex items-center justify-center relative group transition-all duration-200",
                            item
                                ? "bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                                : "bg-muted/5 border-border/50 hover:bg-muted/10"
                        )}
                        title={item ? `${item.displayName} (x${item.count})` : `Slot ${i}`}
                    >
                        {item ? (
                            <div className="flex flex-col items-center justify-center p-1 w-full h-full">
                                <div className="text-[9px] sm:text-[10px] text-center font-medium line-clamp-2 leading-tight select-none">
                                    {item.displayName}
                                </div>
                                {item.count > 1 && (
                                    <div className="absolute bottom-0.5 right-1 text-[10px] font-bold text-primary/80 drop-shadow-sm select-none">
                                        {item.count}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-[8px] opacity-10 select-none">{i}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted/20 border border-border/50">
                <PackageSearch className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Hotbar: Slots 36 - 44
                </p>
            </div>
        </div>
    );
});

InventoryGrid.displayName = 'InventoryGrid';

/**
 * Individual Bot Stat Card
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
    // Map internal status to badge variants
    const getBadgeStyles = (s: string) => {
        const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
            'spawned': { variant: "default", label: "ACTIVE" },
            'connected': { variant: "default", label: "ONLINE" },
            'connecting': { variant: "secondary", label: "CONNECTING" },
            'death': { variant: "destructive", label: "DIED" },
            'kicked': { variant: "destructive", label: "KICKED" },
            'disconnected': { variant: "outline", label: "OFFLINE" }
        };
        return statusMap[s] || { variant: "secondary", label: s.toUpperCase() };
    };

    const badgeConfig = getBadgeStyles(status);

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/10 bg-muted/5">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        status === 'spawned' ? "bg-primary" : "bg-muted-foreground"
                    )} />
                    <CardTitle className="text-sm font-bold tracking-tight truncate max-w-[120px]">
                        {botName}
                    </CardTitle>
                </div>
                <Badge variant={badgeConfig.variant} className="text-[10px] font-black px-1.5 py-0">
                    {badgeConfig.label}
                </Badge>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
                {/* Stats Section */}
                <div className="grid gap-3">
                    {/* Health Bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                            <div className="flex items-center gap-1.5 text-red-500">
                                <Heart className="w-3 h-3 fill-current" />
                                <span>Health</span>
                            </div>
                            <span className="text-muted-foreground">{Math.round(health.health || 0)} / 20</span>
                        </div>
                        <Progress value={((health.health || 0) / 20) * 100} className="h-1.5 bg-red-950/20" />
                    </div>

                    {/* Food Bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                            <div className="flex items-center gap-1.5 text-orange-500">
                                <Utensils className="w-3 h-3 fill-current" />
                                <span>Food</span>
                            </div>
                            <span className="text-muted-foreground">{Math.round(health.food || 0)} / 20</span>
                        </div>
                        <Progress value={((health.food || 0) / 20) * 100} className="h-1.5 bg-orange-950/20" />
                    </div>

                    {/* Experience Bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                            <div className="flex items-center gap-1.5 text-green-500">
                                <Zap className="w-3 h-3 fill-current" />
                                <span>Level {xp.level || 0}</span>
                            </div>
                            <span className="text-muted-foreground">{Math.round((xp.progress || 0) * 100)}%</span>
                        </div>
                        <Progress value={(xp.progress || 0) * 100} className="h-1.5 bg-green-950/20" />
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Inventory Action */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold h-8 uppercase tracking-widest border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
                                <Boxes className="w-3.5 h-3.5 mr-2 text-primary" />
                                Manage ({inventory?.length || 0})
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6 border-border/50 bg-black/95 backdrop-blur-xl">
                            <DialogHeader className="pb-4 border-b border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <Boxes className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold">{botName}</DialogTitle>
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
                        className="text-[10px] font-bold h-8 uppercase tracking-widest"
                    >
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

    // Optimized Bot List (Connected or Active only)
    const connectedBotsList = React.useMemo(() => {
        return (Object.entries(botStatuses) as [string, BotStatusEvent][]).filter(([, status]) =>
            status.status === 'connected' || status.status === 'spawned' || status.status === 'death'
        );
    }, [botStatuses]);

    // Global Stat Analytics
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
        <div className="h-full flex flex-col p-8 space-y-8 overflow-auto scrollbar-thin bg-black/20">
            {/* Page Header */}
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">
                    Command <span className="text-primary">Center</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-70">
                    Real-time bot orchestration and biometrics
                </p>
            </div>

            {connectedBotsList.length === 0 ? (
                <div className="flex-1 flex items-center justify-center animate-in zoom-in-95 duration-500">
                    <Card className="border-dashed border-border/50 bg-black/40 w-full max-w-lg">
                        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <div className="p-6 rounded-2xl bg-muted/10 border border-border/50 relative">
                                    <Activity className="w-10 h-10 text-muted-foreground animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-xl tracking-tight uppercase">System Idle</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    No bots are currently deployed. Initiate a connection protocol in the <span className="text-primary font-bold underline cursor-pointer">Connection</span> tab to commence monitoring.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    {/* Global Analytics Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        {/* Total Bots */}
                        <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Bots</p>
                                    <p className="text-3xl font-black text-primary leading-none">{connectedBotsList.length}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Activity className="w-6 h-6 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health Status */}
                        <Card className="bg-red-500/5 border-red-500/20 hover:bg-red-500/10 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Health</p>
                                    <p className="text-3xl font-black text-red-500 leading-none">{analytics.avgHealth}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-red-500/10">
                                    <Heart className="w-6 h-6 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Max Level reached */}
                        <Card className="bg-green-500/5 border-green-500/20 hover:bg-green-500/10 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max Power</p>
                                    <p className="text-3xl font-black text-green-500 leading-none">L{analytics.maxLevel}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-green-500/10">
                                    <Award className="w-6 h-6 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Count */}
                        <Card className="bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Accumulated</p>
                                    <p className="text-3xl font-black text-orange-500 leading-none">{analytics.totalItems}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-orange-500/10">
                                    <LayoutGrid className="w-6 h-6 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Bots Grid Section */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50 whitespace-nowrap">Deployed Units</h2>
                            <div className="h-[1px] w-full bg-gradient-to-r from-border/50 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
