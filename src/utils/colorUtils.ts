// Color utility functions for the AI Color Palette Generator

export interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
  tailwindClass?: string;
}

// Convert hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Get color name based on HSL values
export const getColorName = (h: number, s: number, l: number): string => {
  if (l < 10) return 'Deep Black';
  if (l > 95) return 'Pure White';
  if (s < 10) {
    if (l < 30) return 'Charcoal';
    if (l < 70) return 'Gray';
    return 'Light Gray';
  }

  if (h >= 0 && h < 30) return l > 60 ? 'Light Red' : 'Deep Red';
  if (h >= 30 && h < 60) return l > 60 ? 'Golden' : 'Brown';
  if (h >= 60 && h < 90) return l > 60 ? 'Light Green' : 'Forest Green';
  if (h >= 90 && h < 150) return l > 60 ? 'Mint' : 'Emerald';
  if (h >= 150 && h < 210) return l > 60 ? 'Sky Blue' : 'Ocean Blue';
  if (h >= 210 && h < 270) return l > 60 ? 'Lavender' : 'Royal Blue';
  if (h >= 270 && h < 330) return l > 60 ? 'Pink' : 'Purple';
  return l > 60 ? 'Rose' : 'Crimson';
};

// Find closest Tailwind color
export const getTailwindClass = (hex: string): string => {
  const tailwindColors = {
    '#ef4444': 'bg-red-500',
    '#f97316': 'bg-orange-500',
    '#eab308': 'bg-yellow-500',
    '#84cc16': 'bg-lime-500',
    '#22c55e': 'bg-green-500',
    '#10b981': 'bg-emerald-500',
    '#14b8a6': 'bg-teal-500',
    '#06b6d4': 'bg-cyan-500',
    '#3b82f6': 'bg-blue-500',
    '#6366f1': 'bg-indigo-500',
    '#8b5cf6': 'bg-violet-500',
    '#a855f7': 'bg-purple-500',
    '#d946ef': 'bg-fuchsia-500',
    '#ec4899': 'bg-pink-500',
    '#f43f5e': 'bg-rose-500',
    '#6b7280': 'bg-gray-500',
    '#374151': 'bg-gray-700',
    '#1f2937': 'bg-gray-800',
    '#111827': 'bg-gray-900',
  };

  const { r, g, b } = hexToRgb(hex);
  let closestColor = 'bg-gray-500';
  let minDistance = Infinity;

  Object.entries(tailwindColors).forEach(([colorHex, className]) => {
    const { r: cr, g: cg, b: cb } = hexToRgb(colorHex);
    const distance = Math.sqrt(
      Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = className;
    }
  });

  return closestColor;
};

// Generate Material Design palette
export const generateMaterialPalette = (dominantColors: string[]): Color[] => {
  return dominantColors.map((hex, index) => {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    
    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      name: getColorName(h, s, l),
    };
  });
};

// Generate Tailwind-friendly palette
export const generateTailwindPalette = (dominantColors: string[]): Color[] => {
  return dominantColors.map((hex, index) => {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    
    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      name: getColorName(h, s, l),
      tailwindClass: getTailwindClass(hex),
    };
  });
};

// Mock AI color extraction (simulates backend processing)
export const extractColorsFromImage = async (file: File): Promise<string[]> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock dominant colors based on file name or random generation
  const mockPalettes = [
    ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'],
    ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
    ['#6366f1', '#ec4899', '#14b8a6', '#84cc16', '#f97316'],
    ['#a855f7', '#3b82f6', '#22c55e', '#eab308', '#f43f5e'],
    ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
  ];
  
  return mockPalettes[Math.floor(Math.random() * mockPalettes.length)];
};

// Generate random aesthetic palette
export const generateRandomPalette = (): string[] => {
  const baseHue = Math.floor(Math.random() * 360);
  const colors: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + i * 72) % 360; // Golden ratio spacing
    const saturation = 60 + Math.random() * 40; // 60-100%
    const lightness = 40 + Math.random() * 40; // 40-80%
    
    const { r, g, b } = hslToRgb(hue, saturation, lightness);
    colors.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  }
  
  return colors;
};

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
};