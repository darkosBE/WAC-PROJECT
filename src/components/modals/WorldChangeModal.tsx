import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { getWorldChangeConfig, saveWorldChangeConfig, WorldChangeConfig } from '@/lib/api';
import { toast } from 'sonner';

interface WorldChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorldChangeModal({ open, onOpenChange }: WorldChangeModalProps) {
  const [config, setConfig] = useState<WorldChangeConfig>({
    delay: 5,
    messages: ['/home']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getWorldChangeConfig()
        .then(setConfig)
        .catch(() => toast.error('Failed to load config'));
    }
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveWorldChangeConfig(config);
      toast.success('World change config saved');
      onOpenChange(false);
    } catch {
      toast.error('Failed to save config');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = () => {
    setConfig(c => ({ ...c, messages: [...c.messages, ''] }));
  };

  const removeMessage = (index: number) => {
    setConfig(c => ({ ...c, messages: c.messages.filter((_, i) => i !== index) }));
  };

  const updateMessage = (index: number, value: string) => {
    setConfig(c => ({
      ...c,
      messages: c.messages.map((m, i) => i === index ? value : m)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>World Change Messages</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Delay after spawn (seconds)</Label>
            <Input 
              type="number" 
              min={0}
              value={config.delay}
              onChange={e => setConfig(c => ({ ...c, delay: parseInt(e.target.value) || 0 }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="mb-2 block">Messages</Label>
            <div className="space-y-2">
              {config.messages.map((msg, i) => (
                <div key={i} className="flex gap-2">
                  <Input 
                    value={msg}
                    onChange={e => updateMessage(i, e.target.value)}
                    placeholder="Enter message or command"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeMessage(i)}
                    disabled={config.messages.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={addMessage}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Message
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
