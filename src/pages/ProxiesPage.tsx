import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Plus, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ProxiesPage() {
  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proxies</h1>
        <p className="text-muted-foreground">Route bot connections through proxy servers for anonymity.</p>
      </div>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Globe className="w-5 h-5 text-primary" />
            Proxy Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Premium Feature</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              The proxy feature is part of our Premium plan. Enable it in settings and add your proxies here to get started.
            </p>
          </div>

          <div className="mt-6 animate-fade-in-up animation-delay-200">
            <h4 className="font-semibold text-foreground mb-2">Add New Proxy</h4>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Format: host:port or host:port:user:pass</p>
              <div className="flex gap-2">
                <Input placeholder="e.g., 127.0.0.1:8080" className="flex-1 bg-input border-border" />
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Proxy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
