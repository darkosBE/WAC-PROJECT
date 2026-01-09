import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getAntiAFKConfig, saveAntiAFKConfig, AntiAFKConfig } from '@/lib/api';
import { toast } from 'sonner';

interface AntiAFKModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AntiAFKModal({ open, onOpenChange }: AntiAFKModalProps) {
  const [config, setConfig] = useState<AntiAFKConfig>({
    interval: 1,
    physical: { forward: true, head: true, arm: false, jump: true },
    chat: { message: '/ping', send: false }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getAntiAFKConfig()
        .then(setConfig)
        .catch(() => toast.error('Failed to load Anti-AFK config'));
    }
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveAntiAFKConfig(config);
      toast.success('Anti-AFK config saved');
      onOpenChange(false);
    } catch {
      toast.error('Failed to save config');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Anti-AFK Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Interval (minutes)</Label>
            <Input 
              type="number" 
              min={1}
              value={config.interval}
              onChange={e => setConfig(c => ({ ...c, interval: parseInt(e.target.value) || 1 }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="mb-3 block">Physical Actions</Label>
            <div className="space-y-2">
              {(['forward', 'head', 'arm', 'jump'] as const).map(action => (
                <div key={action} className="flex items-center gap-2">
                  <Checkbox 
                    id={action}
                    checked={config.physical[action]}
                    onCheckedChange={checked => 
                      setConfig(c => ({ 
                        ...c, 
                        physical: { ...c.physical, [action]: !!checked } 
                      }))
                    }
                  />
                  <Label htmlFor={action} className="capitalize cursor-pointer">{action}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Chat Action</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="chat-send"
                  checked={config.chat.send}
                  onCheckedChange={checked => 
                    setConfig(c => ({ 
                      ...c, 
                      chat: { ...c.chat, send: !!checked } 
                    }))
                  }
                />
                <Label htmlFor="chat-send" className="cursor-pointer">Send chat message</Label>
              </div>
              <Input 
                placeholder="Message to send"
                value={config.chat.message}
                onChange={e => setConfig(c => ({ 
                  ...c, 
                  chat: { ...c.chat, message: e.target.value } 
                }))}
                disabled={!config.chat.send}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
