import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

const credits = {
  developer: {
    name: 'syzdark',
    avatar: 'https://avatars.githubusercontent.com/u/83818134?v=4',
    title: 'Creator',
    reason: 'This project is an alternative of Afk Console Client. It is very easy to use and setup. (ONLY CODERS CAN SET THIS UP WITHOUT USING AI. AND REQUIRES A Virtual Private Server. To USE.)',
  },
  inspiration: {
    name: 'Afk Console Client',
    title: 'Original Inspiration',
    description: 'The original inspiration for this project came from the Afk Console Client. I wanted to create a more modern, web-based version with a more intuitive UI.',
  },
};

export default function CreditsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4 md:p-6 text-white">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Credits</h1>
        <p className="text-gray-400 text-lg">A project made with <Heart className="inline-block w-5 h-5 text-red-500" /> by syzdark</p>
      </div>

      <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-xl overflow-hidden animate-fade-in-up">
        <CardHeader className="bg-gray-700/50 p-6">
          <CardTitle className="text-2xl font-semibold">Lead Developer</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-green-500 shadow-md">
              <AvatarImage src={credits.developer.avatar} alt={credits.developer.name} />
              <AvatarFallback>{credits.developer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{credits.developer.name}</h3>
              <p className="text-green-400 font-medium">{credits.developer.title}</p>
            </div>
          </div>
          <blockquote className="border-l-4 border-green-500 pl-4 py-2 italic text-gray-300 bg-gray-700/30 rounded-r-lg">
            {credits.developer.reason}
          </blockquote>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-xl overflow-hidden animate-fade-in-up animation-delay-200">
        <CardHeader className="bg-gray-700/50 p-6">
          <CardTitle className="text-2xl font-semibold">Inspiration</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold">{credits.inspiration.name}</h3>
            <p className="text-gray-400">{credits.inspiration.title}</p>
          </div>
          <p className="text-gray-300">
            {credits.inspiration.description}
          </p>
          <badge variant="secondary" className="bg-gray-700 text-gray-300">Web Afk Client</badge>
        </CardContent>
      </Card>
    </div>
  );
}
