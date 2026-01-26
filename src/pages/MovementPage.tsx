import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBots, BotAccount } from '@/lib/api';
import { useSocketContext } from '@/contexts/SocketContext';
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronsUp, Hand } from 'lucide-react';

export default function MovementPage() {
  const { controlBot, botStatuses } = useSocketContext();
  const [bots, setBots] = useState<BotAccount[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>(() => localStorage.getItem('selected_bot_movement') || '');

  useEffect(() => {
    localStorage.setItem('selected_bot_movement', selectedBot);
  }, [selectedBot]);

  useEffect(() => {
    getBots().then(setBots).catch(() => { });
  }, []);

  const isConnected = selectedBot &&
    (botStatuses[selectedBot]?.status === 'connected' ||
      botStatuses[selectedBot]?.status === 'spawned');

  const handleMove = (direction: string) => {
    if (!selectedBot || !isConnected) return;
    controlBot(selectedBot, 'move', direction);
  };

  const handleJump = () => {
    if (!selectedBot || !isConnected) return;
    controlBot(selectedBot, 'jump', {});
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bot Movement</h1>
        <p className="text-muted-foreground mt-1">Take direct control of your bots in-game.</p>
      </div>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <Move className="w-6 h-6 text-primary" />
            Movement Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="animate-fade-in-up">
            <label className="text-md text-muted-foreground mb-2 block font-medium">Select Bot</label>
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger className="w-full max-w-sm text-base py-2 px-3 bg-input border-border">
                <SelectValue placeholder="Choose a bot to control" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {bots.map(bot => (
                  <SelectItem key={bot.username} value={bot.username} className="text-base py-2 px-3 hover:bg-primary/10">
                    {bot.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBot && !isConnected && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive-foreground font-medium border border-destructive/20 animate-fade-in-up">
              Bot is not connected. Please connect the bot on the 'Connect' page.
            </div>
          )}

          <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in-up animation-delay-200">
            <div className="grid grid-cols-3 gap-2 w-fit bg-muted/30 p-3 rounded-xl">
              <div />
              <Button variant="secondary" size="lg" className="w-16 h-16 rounded-lg bg-background/50 hover:bg-primary/10 active:scale-95 transition-all" disabled={!isConnected} onClick={() => handleMove('forward')}>
                <ArrowUp className="w-7 h-7" />
              </Button>
              <div />

              <Button variant="secondary" size="lg" className="w-16 h-16 rounded-lg bg-background/50 hover:bg-primary/10 active:scale-95 transition-all" disabled={!isConnected} onClick={() => handleMove('left')}>
                <ArrowLeft className="w-7 h-7" />
              </Button>
              <Button variant="secondary" size="lg" className="w-16 h-16 rounded-lg bg-background/50 hover:bg-destructive/10 active:scale-95 transition-colors" disabled={!isConnected} onClick={() => handleMove('stop')}>
                <Hand className="w-7 h-7" />
              </Button>
              <Button variant="secondary" size="lg" className="w-16 h-16 rounded-lg bg-background/50 hover:bg-primary/10 active:scale-95 transition-all" disabled={!isConnected} onClick={() => handleMove('right')}>
                <ArrowRight className="w-7 h-7" />
              </Button>

              <div />
              <Button variant="secondary" size="lg" className="w-16 h-16 rounded-lg bg-background/50 hover:bg-primary/10 active:scale-95 transition-all" disabled={!isConnected} onClick={() => handleMove('back')}>
                <ArrowDown className="w-7 h-7" />
              </Button>
              <div />
            </div>

            <Button variant="default" size="lg" className="w-full max-w-[240px] h-12 text-base rounded-lg bg-primary hover:bg-primary/90 shadow-md transition-transform hover:scale-105" disabled={!isConnected} onClick={handleJump}>
              <ChevronsUp className="w-5 h-5 mr-2" />
              Jump
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2 animate-fade-in-up animation-delay-400">
            Note: Movement is only active when a bot is connected and spawned in the world.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
