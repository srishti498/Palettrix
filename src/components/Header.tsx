import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center space-y-4 mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
          <Palette className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
          AI Color Palette Generator
        </h1>
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Upload any image and instantly generate professional color palettes for your UI/UX designs. 
        Get Material Design and Tailwind CSS ready colors with perfect contrast ratios.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <div className="glass-card px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-primary">AI-Powered</span>
        </div>
        <div className="glass-card px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-accent">Material Design</span>
        </div>
        <div className="glass-card px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-primary-glow">Tailwind Ready</span>
        </div>
      </div>
    </header>
  );
};