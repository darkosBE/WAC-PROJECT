import { Button } from '@/components/ui/button';
import { Zap, ChevronRight } from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import { cn } from '@/lib/utils';

export function HeroBanner() {
  const { isConnected } = useSocketContext();

  return (
    <div className="relative border-b border-border bg-card">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left side - Icon and Text */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center">
            <img
              src="/bot-icon.png"
              alt="Bot Icon"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                {isConnected ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              AFK 24/7 with your computer turned OFF
            </h1>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Ready to deploy</span>
            <span className="text-xs text-primary font-medium">v26.2.1</span>
          </div>
          <Button className="h-9">
            <Zap className="w-4 h-4 mr-2" />
            Get Started
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
