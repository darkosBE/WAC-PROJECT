import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiUrl, setApiUrl, testConnection, getVersion } from '@/lib/api';
import { useSocketContext } from '@/contexts/SocketContext';
import { toast } from 'sonner';
import { Settings, Server, CheckCircle, XCircle, RefreshCw, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { isConnected, reconnect } = useSocketContext();
  const [apiUrl, setApiUrlState] = useState(getApiUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [backendVersion, setBackendVersion] = useState<string | null>(null);
  const [loadingVersion, setLoadingVersion] = useState(false);

  // Auto-fetch backend version when the page loads or API URL changes
  useEffect(() => {
    const fetchVersion = async () => {
      setLoadingVersion(true);
      try {
        const versionData = await getVersion();
        setBackendVersion(versionData.version);
      } catch (error) {
        setBackendVersion('Error');
      } finally {
        setLoadingVersion(false);
      }
    };
    fetchVersion();
  }, [apiUrl]);

  // --- Auto-Save and Reconnect Logic ---
  useEffect(() => {
    // Set up a timer to save and reconnect 1 second after the user stops typing.
    const handler = setTimeout(() => {
      const currentStoredUrl = getApiUrl();
      if (apiUrl !== currentStoredUrl) {
        console.log('Auto-saving and reconnecting...');
        setApiUrl(apiUrl); // Save the new URL to localStorage
        reconnect(); // Trigger the WebSocket reconnection
        toast.info('Settings auto-saved. Reconnecting...');
        setTestResult(null); // Reset test result on new URL
      }
    }, 1000); // 1-second debounce delay

    // Cleanup function: If the user types again, clear the previous timer.
    return () => {
      clearTimeout(handler);
    };
  }, [apiUrl, reconnect]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    const originalUrl = getApiUrl();
    // Temporarily set the API URL for the test without saving it yet
    setApiUrl(apiUrl);
    
    try {
      const success = await testConnection();
      setTestResult(success);
      if (success) {
        toast.success('Connection successful!');
      } else {
        toast.error('Connection failed');
        setApiUrl(originalUrl); // Revert to the original URL on failure
      }
    } catch {
      setTestResult(false);
      toast.error('Connection failed');
      setApiUrl(originalUrl); // Revert on exception
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure the connection to your Web Afk Client backend.</p>
      </div>

      <Card className="bg-card border-border shadow-lg animate-fade-in-up">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Server className="w-5 h-5 text-primary" />
            Backend Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <div>
                <p className="font-medium text-sm text-foreground">Socket Status</p>
                <p className={cn(
                  "text-xs",
                  isConnected ? "text-green-500" : "text-red-500"
                )}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reconnect} className="text-xs h-8">
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Reconnect
            </Button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="apiUrl" className="font-medium text-sm">Backend API URL</Label>
            <div className="flex gap-2">
              <Input 
                id="apiUrl"
                value={apiUrl}
                onChange={e => {
                  setApiUrlState(e.target.value);
                  setTestResult(null);
                }}
                placeholder="http://localhost:1043"
                className="flex-1 bg-input border-border"
              />
              <Button 
                variant="secondary" 
                onClick={handleTestConnection}
                disabled={testing}
                className="w-24"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the address of your bot server (e.g., http://192.168.1.100:1043).
            </p>
          </div>

          {testResult !== null && (
            <div className={cn(
              "p-3 rounded-lg text-sm",
              testResult ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            )}>
               {testResult ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Connection successful!</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Connection failed. Please check:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside opacity-90">
                      <li>Is the backend server running?</li>
                      <li>Is the URL correct (including http://)?</li>
                      <li>Is the port (default 1043) correct and not blocked?</li>
                      <li>Are you using the correct local IP if on the same network?</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* The "Save & Reconnect" button has been removed as this functionality is now automatic. */}
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-lg animate-fade-in-up animation-delay-200">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Info className="w-5 h-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-sm">
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">UI Version:</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">Backend Version:</span>
              {loadingVersion ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <span className={cn(
                  "font-medium",
                  backendVersion === 'Error' ? 'text-red-500' : 'text-foreground'
                )}>
                  {backendVersion || 'N/A'}
                </span>
              )}
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground">Default Port:</span>
              <span className="font-medium text-foreground">1043</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
