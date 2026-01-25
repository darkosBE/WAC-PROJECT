import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function HeroBanner() {
    return (
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-border overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                {/* Left side - Icon and Text */}
                <div className="flex items-center gap-6">
                    <img
                        src="/bot-icon.png"
                        alt="Bot Icon"
                        className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            AFK <span className="text-primary">24/7</span> with your
                        </h1>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            computer turned <span className="text-destructive">OFF</span>
                        </h1>
                    </div>
                </div>

                {/* Right side - CTA and Illustration */}
                <div className="flex items-center gap-6">
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-primary/50 transition-all hover:shadow-primary/70 hover:scale-105"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get Started
                    </Button>

                </div>
            </div>
        </div>
    );
}
