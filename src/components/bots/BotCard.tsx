import { User, Plug, Unplug, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BotStatusEvent } from '@/hooks/useSocket';

interface BotCardProps {
  username: string;
  status?: BotStatusEvent;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function BotCard({ username, status, onConnect, onDisconnect }: BotCardProps) {
  const botStatus = status?.status || 'disconnected';
  const isConnecting = botStatus === 'connecting';
  const isOnline = botStatus === 'connected' || botStatus === 'spawned';

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isOnline ? "bg-primary/20" : "bg-muted"
            )}>
              <User className={cn(
                "w-5 h-5",
                isOnline ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">{username}</p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isOnline ? "bg-primary" : isConnecting ? "bg-warning animate-pulse" : "bg-muted-foreground"
                )} />
                <span className="text-xs text-muted-foreground capitalize">
                  {status?.message || 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOnline || isConnecting ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDisconnect();
                }}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Unplug className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onConnect}
              >
                <Plug className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
