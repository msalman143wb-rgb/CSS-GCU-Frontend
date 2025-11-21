import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GallerySliderProps {
  images: GalleryImage[];
  title: string;
}

export default function GallerySlider({ images, title }: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
        <div className="relative group">
          <div className="aspect-video overflow-hidden rounded-lg cursor-pointer">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={() => openLightbox(currentIndex)}
              data-testid={`gallery-image-${currentIndex}`}
            />
          </div>

          {images[currentIndex].caption && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {images[currentIndex].caption}
            </p>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            onClick={goToPrevious}
            data-testid="button-gallery-previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            onClick={goToNext}
            data-testid="button-gallery-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              data-testid={`gallery-dot-${index}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`aspect-video overflow-hidden rounded cursor-pointer border-2 transition-all ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              }`}
              onClick={() => setCurrentIndex(index)}
              data-testid={`gallery-thumbnail-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setLightboxOpen(false)}
            data-testid="button-lightbox-close"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={lightboxPrevious}
            data-testid="button-lightbox-previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {images[lightboxIndex].caption && (
              <p className="text-white mt-4 text-center">
                {images[lightboxIndex].caption}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={lightboxNext}
            data-testid="button-lightbox-next"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
