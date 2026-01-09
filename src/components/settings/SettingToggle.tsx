import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  hasConfig?: boolean;
  onConfigClick?: () => void;
}

export function SettingToggle({ 
  label, 
  description, 
  checked, 
  onCheckedChange, 
  hasConfig, 
  onConfigClick 
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasConfig && checked && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onConfigClick}
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}
