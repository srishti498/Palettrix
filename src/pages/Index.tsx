import React, { useState } from 'react';
import { Shuffle, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { ColorPalette } from '@/components/ColorPalette';
import {
  extractColorsFromImage,
  generateMaterialPalette,
  generateTailwindPalette,
  generateRandomPalette,
  type Color,
} from '@/utils/colorUtils';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [materialColors, setMaterialColors] = useState<Color[]>([]);
  const [tailwindColors, setTailwindColors] = useState<Color[]>([]);

  const handleImageUpload = async (file: File) => {
    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsProcessing(true);

    try {
      // Simulate AI processing
      toast.info('Analyzing image colors with AI...');
      const dominantColors = await extractColorsFromImage(file);
      
      // Generate palettes
      const materialPalette = generateMaterialPalette(dominantColors);
      const tailwindPalette = generateTailwindPalette(dominantColors);
      
      setMaterialColors(materialPalette);
      setTailwindColors(tailwindPalette);
      
      toast.success('Color palettes generated successfully!');
    } catch (error) {
      toast.error('Failed to process image. Please try again.');
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setMaterialColors([]);
    setTailwindColors([]);
  };

  const handleRandomPalette = () => {
    toast.info('Generating random aesthetic palette...');
    const randomColors = generateRandomPalette();
    const materialPalette = generateMaterialPalette(randomColors);
    const tailwindPalette = generateTailwindPalette(randomColors);
    
    setMaterialColors(materialPalette);
    setTailwindColors(tailwindPalette);
    toast.success('Random palette generated!');
  };

  const downloadAllPalettes = () => {
    const allPalettes = {
      materialDesign: {
        title: 'Material Design Palette',
        colors: materialColors,
      },
      tailwindCSS: {
        title: 'Tailwind CSS Palette',
        colors: tailwindColors,
      },
      generatedAt: new Date().toISOString(),
      source: uploadedImage ? 'Image Upload' : 'Random Generation',
    };

    const blob = new Blob([JSON.stringify(allPalettes, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete-color-palettes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('All palettes downloaded!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <Header />

        {/* Upload Section */}
        <section className="space-y-6">
          <ImageUpload
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            onRemoveImage={handleRemoveImage}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleRandomPalette}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isProcessing}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Generate Random Palette
            </Button>

            {(materialColors.length > 0 || tailwindColors.length > 0) && (
              <Button
                variant="outline"
                onClick={downloadAllPalettes}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download All Palettes
              </Button>
            )}
          </div>
        </section>

        {/* Loading State */}
        {isProcessing && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-primary animate-spin" />
              <span className="text-lg font-medium gradient-text">
                AI is analyzing your image...
              </span>
            </div>
            <p className="text-muted-foreground">
              Extracting dominant colors and generating professional palettes
            </p>
          </div>
        )}

        {/* Color Palettes */}
        {!isProcessing && materialColors.length > 0 && (
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Your AI-Generated Palettes
              </h2>
              <p className="text-muted-foreground">
                Professional color schemes ready for your next project
              </p>
            </div>

            <div className="grid gap-8">
              <ColorPalette
                colors={materialColors}
                title="Material Design Palette"
                subtitle="Google Material Design inspired colors with perfect harmony"
                type="material"
              />

              <ColorPalette
                colors={tailwindColors}
                title="Tailwind CSS Palette"
                subtitle="Ready-to-use Tailwind classes for rapid development"
                type="tailwind"
              />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 pb-8">
          <div className="glass-card rounded-2xl p-6 inline-block">
            <p className="text-muted-foreground">
              Made with ❤️ using AI • Perfect for UI/UX designers and developers
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;