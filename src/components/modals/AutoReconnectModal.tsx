import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAutoReconnectConfig, saveAutoReconnectConfig, AutoReconnectConfig } from '@/lib/api';
import { toast } from 'sonner';

interface AutoReconnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoReconnectModal({ open, onOpenChange }: AutoReconnectModalProps) {
  const [config, setConfig] = useState<AutoReconnectConfig>({ delay: 4 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getAutoReconnectConfig()
        .then(setConfig)
        .catch(() => toast.error('Failed to load config'));
    }
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveAutoReconnectConfig(config);
      toast.success('Auto-reconnect config saved');
      onOpenChange(false);
    } catch {
      toast.error('Failed to save config');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle>Auto-Reconnect Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Reconnect delay (seconds)</Label>
            <Input 
              type="number" 
              min={1}
              value={config.delay}
              onChange={e => setConfig({ delay: parseInt(e.target.value) || 1 })}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Time to wait before attempting to reconnect after disconnection
            </p>
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
