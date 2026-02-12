import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SettingToggle } from '@/components/settings/SettingToggle';
import { AntiAFKModal } from '@/components/modals/AntiAFKModal';
import { JoinMessagesModal } from '@/components/modals/JoinMessagesModal';
import { WorldChangeModal } from '@/components/modals/WorldChangeModal';
import { AutoReconnectModal } from '@/components/modals/AutoReconnectModal';
import { AddBotModal } from '@/components/modals/AddBotModal';
import { useSocketContext } from '@/contexts/SocketContext';
import {
  getServerInfo, saveServerInfo, ServerInfo,
  getSettings, saveSettings, BotSettings,
  getBots, saveBots, BotAccount
} from '@/lib/api';
import { toast } from 'sonner';
import { 
  Plus, XCircle, Power, Loader2, Server, Settings, Users, 
  Zap, Globe, Save, Play, Square, Bot, Activity, Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConnectPage() {
  const { botStatuses, connectBot, disconnectBot } = useSocketContext();

  const [serverInfo, setServerInfo] = useState<ServerInfo>({
    serverIP: 'swiftsmp.net',
    serverPort: 25565,
    version: '1.17',
    loginDelay: 5
  });

  const [settings, setSettings] = useState<BotSettings>({
    sneak: false,
    botPhysics: true,
    antiAFK: false,
    autoReconnect: false,
    joinMessages: true,
    worldChangeMessages: false,
    proxies: false,
    fakeHost: false,
    antiAFKInterval: 1,
    antiAFKPhysical: { forward: true, head: true, arm: false, jump: true },
    antiAFKChat: { message: '/ping', send: false },
    joinMessageDelay: 2,
    joinMessagesList: ['Hello world'],
    worldChangeMessageDelay: 5,
    worldChangeMessagesList: ['/home'],
    autoReconnectDelay: 4,
  });

  const [bots, setBots] = useState<BotAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [antiAFKOpen, setAntiAFKOpen] = useState(false);
  const [joinMessagesOpen, setJoinMessagesOpen] = useState(false);
  const [worldChangeOpen, setWorldChangeOpen] = useState(false);
  const [autoReconnectOpen, setAutoReconnectOpen] = useState(false);
  const [addBotOpen, setAddBotOpen] = useState(false);

  useEffect(() => {
    Promise.all([getServerInfo(), getSettings(), getBots()])
      .then(([info, set, bts]) => {
        setServerInfo(info);
        setSettings(set);
        setBots(bts);
      })
      .catch(() => toast.error('Failed to load data from server'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settings);
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  }

  const handleSaveIp = async () => {
    try {
      await saveServerInfo(serverInfo);
      toast.success('Server information saved successfully!');
    } catch (e) {
      toast.error('Failed to save server information.');
    }
  }

  const handleSettingChange = (key: keyof BotSettings, value: boolean) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const handleConnectAll = () => {
    let count = 0;
    bots.forEach(bot => {
      const status = botStatuses[bot.username]?.status;
      const isActive = status && (status === 'connected' || status === 'spawned' || status === 'connecting');
      if (!isActive) {
        connectBot(bot.username, serverInfo.version);
        count++;
      }
    });
    if (count > 0) {
      toast.success(`Connecting ${count} bot${count !== 1 ? 's' : ''}...`);
    } else {
      toast.info('All bots are already connected');
    }
  };

  const handleDisconnectAll = () => {
    let count = 0;
    bots.forEach(bot => {
      const status = botStatuses[bot.username]?.status;
      const isActive = status && (status === 'connected' || status === 'spawned');
      if (isActive) {
        disconnectBot(bot.username);
        count++;
      }
    });
    if (count > 0) {
      toast.success(`Disconnecting ${count} bot${count !== 1 ? 's' : ''}...`);
    } else {
      toast.info('No bots to disconnect');
    }
  };

  const handleAddBot = async (bot: BotAccount) => {
    const newBots = [...bots, bot];
    setBots(newBots);
    try {
      await saveBots(newBots);
      toast.success('Bot added successfully');
      setAddBotOpen(false);
    } catch {
      toast.error('Failed to add bot');
    }
  };

  const handleRemoveBot = async (username: string) => {
    const newBots = bots.filter(b => b.username !== username);
    setBots(newBots);
    try {
      await saveBots(newBots);
      toast.success('Bot removed');
    } catch {
      toast.error('Failed to remove bot');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading configuration...</p>
        </div>
      </div>
    );
  }

  const connectedCount = bots.filter(bot => {
    const status = botStatuses[bot.username]?.status;
    return status === 'connected' || status === 'spawned';
  }).length;

  return (
    <div className="space-y-6 animate-slide-up max-w-7xl mx-auto">
      {/* Header - Clean */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Connection Manager
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure server settings, manage bot accounts, and control connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Server Information Card - Clean */}
        <Card className="glass-card border-border">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center">
                <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">Server Info</CardTitle>
                <p className="text-xs text-muted-foreground">Connection Configuration</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="server-ip" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Server IP
              </Label>
              <Input 
                id="server-ip" 
                value={serverInfo.serverIP} 
                onChange={e => setServerInfo(s => ({ ...s, serverIP: e.target.value }))} 
                className="h-9"
                placeholder="e.g., localhost"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="server-version" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Version
                </Label>
                <Input 
                  id="server-version" 
                  value={serverInfo.version} 
                  onChange={e => setServerInfo(s => ({ ...s, version: e.target.value }))} 
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-delay" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Delay (s)
                </Label>
                <Input 
                  id="login-delay" 
                  type="number" 
                  value={serverInfo.loginDelay} 
                  onChange={e => setServerInfo(s => ({ ...s, loginDelay: parseInt(e.target.value) || 0 }))} 
                  className="h-9"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button 
                variant="outline" 
                className="w-full h-9 text-sm font-medium"
                onClick={handleSaveIp}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Info
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="h-9 text-sm font-medium"
                  onClick={handleConnectAll}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button 
                  variant="destructive" 
                  className="h-9 text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/30"
                  onClick={handleDisconnectAll}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card - Clean */}
        <Card className="glass-card border-border">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center">
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">Bot Settings</CardTitle>
                <p className="text-xs text-muted-foreground">Behavior Configuration</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="space-y-2">
              <SettingToggle 
                label="Sneak Mode" 
                checked={settings.sneak} 
                onCheckedChange={v => handleSettingChange('sneak', v)} 
              />
              <SettingToggle 
                label="Bot Physics" 
                checked={settings.botPhysics} 
                onCheckedChange={v => handleSettingChange('botPhysics', v)} 
              />
              <SettingToggle 
                label="Anti AFK" 
                checked={settings.antiAFK} 
                onCheckedChange={v => handleSettingChange('antiAFK', v)} 
                hasConfig 
                onConfigClick={() => setAntiAFKOpen(true)} 
              />
              <SettingToggle 
                label="Auto Reconnect" 
                checked={settings.autoReconnect} 
                onCheckedChange={v => handleSettingChange('autoReconnect', v)} 
                hasConfig 
                onConfigClick={() => setAutoReconnectOpen(true)} 
              />
              <SettingToggle 
                label="Join Messages" 
                checked={settings.joinMessages} 
                onCheckedChange={v => handleSettingChange('joinMessages', v)} 
                hasConfig 
                onConfigClick={() => setJoinMessagesOpen(true)} 
              />
              <SettingToggle 
                label="World Change" 
                checked={settings.worldChangeMessages} 
                onCheckedChange={v => handleSettingChange('worldChangeMessages', v)} 
                hasConfig 
                onConfigClick={() => setWorldChangeOpen(true)} 
              />
              <SettingToggle 
                label="Use Proxies" 
                checked={settings.proxies} 
                onCheckedChange={v => handleSettingChange('proxies', v)} 
              />
              <SettingToggle 
                label="Fake Host" 
                checked={settings.fakeHost} 
                onCheckedChange={v => handleSettingChange('fakeHost', v)} 
              />
            </div>
            
            <Button 
              className="w-full h-9 text-sm font-medium mt-2"
              onClick={handleSaveSettings}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Accounts Card - Clean */}
        <Card className="glass-card border-border">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Bot Accounts</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {connectedCount} / {bots.length} Connected
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => setAddBotOpen(true)}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="bg-muted/50 rounded-lg border border-border overflow-hidden">
              <div className="max-h-[280px] overflow-y-auto scrollbar-thin">
                {bots.length > 0 ? (
                  <div className="divide-y divide-border">
                    {bots.map((bot) => {
                      const status = botStatuses[bot.username];
                      const isOnline = status && (status.status === 'connected' || status.status === 'spawned');
                      const isConnecting = status && status.status === 'connecting';

                      return (
                        <div 
                          key={bot.username} 
                          className={cn(
                            "flex items-center justify-between p-3 transition-colors",
                            isOnline && "bg-green-50 dark:bg-green-500/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-md flex items-center justify-center border",
                              isOnline 
                                ? "bg-green-100 border-green-300 dark:bg-green-500/20 dark:border-green-500/30" 
                                : "bg-muted border-border"
                            )}>
                              <Bot className={cn(
                                "w-4 h-4",
                                isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              )} />
                            </div>
                            <div>
                              <span className="font-medium text-sm text-foreground block">{bot.username}</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-wider font-medium",
                                isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              )}>
                                {isOnline ? 'Online' : isConnecting ? 'Connecting...' : 'Offline'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveBot(bot.username)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const status = botStatuses[bot.username]?.status;
                                const isActive = status && (status === 'connected' || status === 'spawned' || status === 'connecting');

                                if (isActive) {
                                  disconnectBot(bot.username);
                                } else {
                                  connectBot(bot.username, serverInfo.version);
                                }
                              }}
                              disabled={isConnecting}
                              className="h-8 w-8"
                            >
                              {isConnecting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              ) : (
                                <Power className={cn(
                                  "w-4 h-4",
                                  isOnline ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground hover:text-green-600'
                                )} />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Terminal className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No bots added yet</p>
                    <p className="text-muted-foreground/60 text-xs mt-0.5">Click "Add" to create a bot</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AntiAFKModal open={antiAFKOpen} onOpenChange={setAntiAFKOpen} />
      <JoinMessagesModal open={joinMessagesOpen} onOpenChange={setJoinMessagesOpen} />
      <WorldChangeModal open={worldChangeOpen} onOpenChange={setWorldChangeOpen} />
      <AutoReconnectModal open={autoReconnectOpen} onOpenChange={setAutoReconnectOpen} />
      <AddBotModal open={addBotOpen} onOpenChange={setAddBotOpen} onAdd={handleAddBot} />
    </div>
  );
}
