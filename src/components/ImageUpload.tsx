import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  onRemoveImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onRemoveImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedImage) {
    return (
      <div className="glass-card rounded-2xl p-6 relative">
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-10"
          onClick={onRemoveImage}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="relative w-full h-64 rounded-xl overflow-hidden">
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center mt-4 text-muted-foreground font-medium">
          Image uploaded successfully! Colors are being analyzed...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`glass-card rounded-2xl p-8 upload-area cursor-pointer border-2 border-dashed transition-all duration-300 ${
        isDragOver ? 'dragover' : 'border-glass-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center">
          <Upload className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold gradient-text">
            Upload Your Image
          </h3>
          <p className="text-muted-foreground">
            Drag and drop an image here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PNG, JPG, JPEG
          </p>
        </div>
        
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <ImageIcon className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      </div>
    </div>
  );
};