import React, { useState } from 'react';
import { Copy, Check, Download, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
  tailwindClass?: string;
}

interface ColorPaletteProps {
  colors: Color[];
  title: string;
  subtitle: string;
  type: 'material' | 'tailwind';
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  title,
  subtitle,
  type,
}) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    toast.success(`Copied ${text}`);
    
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const downloadPalette = () => {
    const paletteData = {
      title,
      type,
      colors: colors.map(color => ({
        name: color.name,
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        ...(color.tailwindClass && { tailwindClass: color.tailwindClass }),
      })),
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Palette downloaded!');
  };

  const CopyButton: React.FC<{ text: string; copyKey: string }> = ({ text, copyKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(text, copyKey);
      }}
    >
      {copiedStates[copyKey] ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold gradient-text">{title}</h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadPalette}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="group space-y-3"
          >
            {/* Color Swatch */}
            <div
              className="color-swatch w-full h-24 rounded-xl border-2 border-white/20 shadow-elegant cursor-pointer"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
            />

            {/* Color Info */}
            <div className="space-y-2">
              {/* Color Name */}
              <div className="flex items-center justify-between group/item">
                <p className="font-medium text-sm">{color.name}</p>
                <CopyButton text={color.name} copyKey={`name-${index}`} />
              </div>

              {/* HEX */}
              <div className="flex items-center justify-between group/item">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {color.hex}
                </code>
                <CopyButton text={color.hex} copyKey={`hex-${index}`} />
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between group/item">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {color.rgb}
                </code>
                <CopyButton text={color.rgb} copyKey={`rgb-${index}`} />
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between group/item">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {color.hsl}
                </code>
                <CopyButton text={color.hsl} copyKey={`hsl-${index}`} />
              </div>

              {/* Tailwind Class (if available) */}
              {color.tailwindClass && (
                <div className="flex items-center justify-between group/item">
                  <code className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-mono">
                    {color.tailwindClass}
                  </code>
                  <CopyButton text={color.tailwindClass} copyKey={`tw-${index}`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};