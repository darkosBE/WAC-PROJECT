import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBots, saveBots, BotAccount } from '@/lib/api';
import { AddBotModal } from '@/components/modals/AddBotModal';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, User, Download, Upload, Users } from 'lucide-react';

export default function AccountsPage() {
  const [bots, setBots] = useState<BotAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editBot, setEditBot] = useState<BotAccount | null>(null);

  useEffect(() => {
    getBots()
      .then(setBots)
      .catch(() => toast.error('Failed to load bots'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBot = async (bot: BotAccount) => {
    const exists = bots.find(b => b.username === bot.username);
    let newBots: BotAccount[];
    
    if (editBot) {
      newBots = bots.map(b => b.username === editBot.username ? bot : b);
    } else if (exists) {
      toast.error('Bot with this username already exists');
      return;
    } else {
      newBots = [...bots, bot];
    }
    
    setBots(newBots);
    setEditBot(null);
    
    try {
      await saveBots(newBots);
      toast.success(editBot ? 'Bot updated' : 'Bot added');
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (username: string) => {
    const newBots = bots.filter(b => b.username !== username);
    setBots(newBots);
    
    try {
      await saveBots(newBots);
      toast.success('Bot deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(bots, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bots.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Bots exported');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text) as BotAccount[];
      
      if (!Array.isArray(imported)) {
        throw new Error('Invalid format');
      }
      
      setBots(imported);
      await saveBots(imported);
      toast.success(`Imported ${imported.length} bots`);
    } catch {
      toast.error('Failed to import - invalid file');
    }
    
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
        <p className="text-muted-foreground">Manage your bot accounts</p>
      </div>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Users className="w-5 h-5 text-primary" />
              Bot Accounts ({bots.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} disabled={bots.length === 0}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-1" />
                    Import
                  </span>
                </Button>
                <Input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleImport}
                />
              </label>
              <Button size="sm" onClick={() => setAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                Add Bot
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {bots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in-up">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No bot accounts configured</p>
              <p className="text-sm mt-1">Click "Add Bot" to create your first bot account</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bots.map((bot, index) => (
                <div 
                  key={bot.username}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bot.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {bot.password ? 'Premium account' : 'Offline account'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditBot(bot);
                        setAddModalOpen(true);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(bot.username)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddBotModal 
        open={addModalOpen} 
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) setEditBot(null);
        }}
        onAdd={handleAddBot}
        editBot={editBot}
      />
    </div>
  );
}
