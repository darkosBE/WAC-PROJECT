import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, XCircle, Power, Loader2, Server, Settings, Users, Save } from 'lucide-react';

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
      toast.success('Settings saved');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  }

  // New function to save only the server IP details
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
    bots.forEach(bot => {
        if (botStatuses[bot.username]?.status !== 'connected') {
            connectBot(bot.username, serverInfo.version);
        }
    });
  };

  const handleDisconnectAll = () => {
      bots.forEach(bot => {
          if (botStatuses[bot.username]?.status === 'connected') {
              disconnectBot(bot.username);
          }
      });
  };
    
  const handleAddBot = async (bot: BotAccount) => {
    const newBots = [...bots, bot];
    setBots(newBots);
    try {
      await saveBots(newBots);
      toast.success('Bot added');
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
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-card p-6 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-up">
          {/* Premium banner */}
      </div>
        
      <h1 className="text-2xl font-bold text-foreground">Connect</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 animate-fade-in-up animation-delay-200">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Server className="w-5 h-5 text-primary" />Information</h2>
          <div>
              <Label htmlFor="server-ip">Server IP*</Label>
              <Input id="server-ip" value={serverInfo.serverIP} onChange={e => setServerInfo(s => ({...s, serverIP: e.target.value}))} className="mt-1 bg-input" />
          </div>
          <div>
              <Label htmlFor="server-version">Server version</Label>
              <Input id="server-version" value={serverInfo.version} onChange={e => setServerInfo(s => ({...s, version: e.target.value}))} className="mt-1 bg-input" />
          </div>
          <div>
              <Label htmlFor="login-delay">Login delay (s)</Label>
              <Input id="login-delay" type="number" value={serverInfo.loginDelay} onChange={e => setServerInfo(s => ({...s, loginDelay: parseInt(e.target.value) || 0}))} className="mt-1 bg-input" />
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleConnectAll}>Connect All</Button>
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleDisconnectAll}>Disconnect All</Button>
          {/* The new "Save IP" button */}
          <Button className="w-full" onClick={handleSaveIp}>
            <Save className="w-4 h-4 mr-2" />
            Save IP
          </Button>
        </Card>

        <Card className="p-6 space-y-2 animate-fade-in-up animation-delay-400">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Settings className="w-5 h-5 text-primary" />Settings</h2>
            <SettingToggle label="Sneak" checked={settings.sneak} onCheckedChange={v => handleSettingChange('sneak', v)} />
            <SettingToggle label="Bot physics" checked={settings.botPhysics} onCheckedChange={v => handleSettingChange('botPhysics', v)} />
            <SettingToggle label="Anti AFK" checked={settings.antiAFK} onCheckedChange={v => handleSettingChange('antiAFK', v)} hasConfig onConfigClick={() => setAntiAFKOpen(true)} />
            <SettingToggle label="Autoreconnect" checked={settings.autoReconnect} onCheckedChange={v => handleSettingChange('autoReconnect', v)} hasConfig onConfigClick={() => setAutoReconnectOpen(true)} />
            <SettingToggle label="Join messages" checked={settings.joinMessages} onCheckedChange={v => handleSettingChange('joinMessages', v)} hasConfig onConfigClick={() => setJoinMessagesOpen(true)} />
            <SettingToggle label="World change" checked={settings.worldChangeMessages} onCheckedChange={v => handleSettingChange('worldChangeMessages', v)} hasConfig onConfigClick={() => setWorldChangeOpen(true)} />
            <SettingToggle label="Proxies" checked={settings.proxies} onCheckedChange={v => handleSettingChange('proxies', v)} />
            <SettingToggle label="Fake host" checked={settings.fakeHost} onCheckedChange={v => handleSettingChange('fakeHost', v)} />
            <Button className="w-full pt-4" onClick={handleSaveSettings}>Save Settings</Button>
        </Card>

        <Card className="p-6 space-y-2 animate-fade-in-up animation-delay-400">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-primary" />Accounts</h2>
              <Button size="sm" onClick={() => setAddBotOpen(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>
            <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                    {(bots.length > 0) ? bots.map(bot => {
                      const status = botStatuses[bot.username];
                      const isOnline = status && (status.status === 'connected' || status.status === 'spawned');
                      const isConnecting = status && status.status === 'connecting';

                      return (
                        <div key={bot.username} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <span className="font-medium">{bot.username}</span>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveBot(bot.username)} className="text-muted-foreground hover:text-destructive">
                                    <XCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (isOnline) {
                                      disconnectBot(bot.username);
                                    } else {
                                      connectBot(bot.username, serverInfo.version);
                                    }
                                  }}
                                  disabled={isConnecting}
                                  className="text-muted-foreground"
                                >
                                  {isConnecting ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  ) : (
                                    <Power className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'hover:text-green-500'}`} />
                                  )}
                                </Button>
                            </div>
                        </div>
                      )}
                    ) : <p className="text-muted-foreground text-center py-8">No bots added.</p>}
                </CardContent>
            </Card>
        </Card>
      </div>
      
      <AntiAFKModal open={antiAFKOpen} onOpenChange={setAntiAFKOpen} />
      <JoinMessagesModal open={joinMessagesOpen} onOpenChange={setJoinMessagesOpen} />
      <WorldChangeModal open={worldChangeOpen} onOpenChange={setWorldChangeOpen} />
      <AutoReconnectModal open={autoReconnectOpen} onOpenChange={setAutoReconnectOpen} />
      <AddBotModal open={addBotOpen} onOpenChange={setAddBotOpen} onAdd={handleAddBot} />
    </div>
  );
}
