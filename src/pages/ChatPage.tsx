import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocketContext } from '@/contexts/SocketContext';
import { getBots, BotAccount } from '@/lib/api';
import { Send, Trash2, MessageSquare, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { chatMessages, sendChat, sendSpam, clearChat } = useSocketContext();
  const [bots, setBots] = useState<BotAccount[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>(() => localStorage.getItem('selected_bot_chat') || '');

  useEffect(() => {
    localStorage.setItem('selected_bot_chat', selectedBot);
  }, [selectedBot]);
  const [message, setMessage] = useState('');
  const [spamMessage, setSpamMessage] = useState('');
  const [spamDelay, setSpamDelay] = useState(20);
  const [spamEnabled, setSpamEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBots().then(setBots).catch(() => { });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!selectedBot || !message.trim()) return;
    sendChat(selectedBot, message.trim());
    setMessage('');
  };

  const handleSpamToggle = () => {
    if (!selectedBot || !spamMessage.trim()) return;
    const newEnabled = !spamEnabled;
    setSpamEnabled(newEnabled);
    sendSpam(selectedBot, spamMessage, spamDelay, newEnabled);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl h-full animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chat</h1>
        <p className="text-muted-foreground">Monitor and send messages through your bots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border shadow-lg">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="w-5 h-5 text-primary" />
                Chat Log
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
              <div className="space-y-1 font-mono text-sm">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground animate-fade-in-up">
                    No messages yet. Connect a bot to see chat.
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className="py-1 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                      <span className="text-primary">[{msg.botName}]</span>{' '}
                      <span className="text-muted-foreground">{msg.username}:</span>{' '}
                      <span className="text-foreground break-words whitespace-pre-wrap">{msg.message}</span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger className="w-40 bg-input">
                  <SelectValue placeholder="Select bot" />
                </SelectTrigger>
                <SelectContent>
                  {bots.map(bot => (
                    <SelectItem key={bot.username} value={bot.username}>
                      {bot.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-input"
              />
              <Button onClick={handleSend} disabled={!selectedBot || !message.trim()} className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-lg animate-fade-in-up animation-delay-200">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Radio className="w-5 h-5 text-primary" />
              Spam Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bot</label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger className="mt-1 bg-input">
                  <SelectValue placeholder="Select bot" />
                </SelectTrigger>
                <SelectContent>
                  {bots.map(bot => (
                    <SelectItem key={bot.username} value={bot.username}>
                      {bot.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <Input
                placeholder="Spam message"
                value={spamMessage}
                onChange={e => setSpamMessage(e.target.value)}
                className="mt-1 bg-input"
                disabled={spamEnabled}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Delay (seconds)</label>
              <Input
                type="number"
                min={1}
                value={spamDelay}
                onChange={e => setSpamDelay(parseInt(e.target.value) || 20)}
                className="mt-1 bg-input"
                disabled={spamEnabled}
              />
            </div>

            <Button
              onClick={handleSpamToggle}
              disabled={!selectedBot || !spamMessage.trim()}
              variant={spamEnabled ? "destructive" : "default"}
              className="w-full transition-all"
            >
              {spamEnabled ? 'Stop Spam' : 'Start Spam'}
            </Button>

            {spamEnabled && (
              <p className={cn("text-sm text-center font-semibold", "text-primary animate-pulse")}>
                Spamming active...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
