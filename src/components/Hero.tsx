import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage1 from "/attached_assets/generated_images/GCU_Lahore_campus_hero_cf930b50.png";
import heroImage2 from "/attached_assets/generated_images/2.jpg";
import heroImage3 from "/attached_assets/generated_images/3.jpg";
import { motion, AnimatePresence } from "framer-motion";
import EventRegistrationForm from "@/components/EventRegistrationForm";

// Looping Typewriter component
const LoopTypewriter: React.FC<{ texts: string[]; typingSpeed?: number; pause?: number }> = ({
  texts,
  typingSpeed = 100,
  pause = 1500,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayed((prev) => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
      }, typingSpeed / 2);
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, typingSpeed, pause]);

  return <span>{displayed}</span>;
};

const Hero: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Array of hero images
  const heroImages = [heroImage1, heroImage2, heroImage3];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Auto-slide always goes left
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const scrollToSection = (id: string): void => {
    const element = document.querySelector<HTMLElement>(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Variants for slide animation
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0.8
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-50%" : "50%",
      opacity: 0.5
    })
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Image Slider */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentSlide}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                duration: 1.2, // Increased from 0.8 to 1.2 seconds
                ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out curve for smoother motion
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
          >
            <LoopTypewriter
              texts={["Computer Science Society", "Innovation & Technology", "Future of Computing"]}
              typingSpeed={100}
              pause={1500}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-3 md:mb-4"
          >
            Government College University Lahore
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto px-4"
          >
            Join us in exploring innovation, technology, and the future of computer science
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary-border w-full sm:w-auto"
              onClick={() => scrollToSection("#events")}
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm w-full sm:w-auto"
              onClick={() => setIsEventModalOpen(true)}
            >
              Join us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Event Registration Form Modal */}
      {isEventModalOpen && (
        <EventRegistrationForm
          eventTitle="Join Computer Science Society"
          onClose={() => setIsEventModalOpen(false)}
        />
      )}
    </>
  );
};

export default Hero;