import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Plus, Trash2, Save, XCircle } from 'lucide-react';
import { getProxies, saveProxies } from '@/lib/api';
import { toast } from 'sonner';

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<string[]>([]);
  const [newProxy, setNewProxy] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProxies();
  }, []);

  const loadProxies = async () => {
    try {
      const data = await getProxies();
      const proxyList = data ? data.split('\n').filter(p => p.trim() !== '') : [];
      setProxies(proxyList);
    } catch (error) {
      toast.error('Failed to load proxies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProxy = async () => {
    if (!newProxy.trim()) return;


    const updatedList = [...proxies, newProxy.trim()];

    try {
      await saveProxies(updatedList.join('\n'));
      setProxies(updatedList);
      setNewProxy('');
      toast.success('Proxy added');
    } catch (error) {
      toast.error('Failed to save proxy');
    }
  };

  const handleDeleteProxy = async (index: number) => {
    const updatedList = proxies.filter((_, i) => i !== index);

    try {
      await saveProxies(updatedList.join('\n'));
      setProxies(updatedList);
      toast.success('Proxy removed');
    } catch (error) {
      toast.error('Failed to remove proxy');
    }
  };

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
        <CardContent className="pt-6 space-y-6">

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Add New Proxy</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Format: host:port or host:port:user:pass"
                value={newProxy}
                onChange={(e) => setNewProxy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProxy()}
                className="flex-1 bg-input border-border"
              />
              <Button onClick={handleAddProxy} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports HTTP/HTTPS proxies. Formatting must be exact.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Configured Proxies</h4>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : proxies.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border text-muted-foreground">
                No proxies configured.
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {proxies.map((proxy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors group">
                    <code className="text-sm font-mono text-foreground">{proxy}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProxy(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
