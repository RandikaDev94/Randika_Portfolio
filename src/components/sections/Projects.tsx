"use client";

import { useState, useEffect } from "react";
import { PORTFOLIO_DATA } from "@/constants/data";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalProjects = PORTFOLIO_DATA.projects.length;

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalProjects);
    }, 5000); // Auto-slides every 5 seconds
    
    return () => clearInterval(timer);
  }, [isHovered, totalProjects]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  };

  const project = PORTFOLIO_DATA.projects[currentIndex];

  return (
    <section id="projects" className="py-24 border-t border-foreground/5 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl mb-16">
        <SplitText text="Selected Work" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div 
          className="relative max-w-4xl mx-auto w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card container fixed minimum height to prevent jumping between varying content */}
          <div className="min-h-[450px] relative w-full perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // smooth easeOut
                className="bg-foreground/5 border border-foreground/10 rounded-[2rem] p-8 md:p-12 w-full backdrop-blur-sm relative group shadow-xl"
              >
                <div className="absolute top-6 right-6 lg:top-8 lg:right-8 opacity-60 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:scale-105 hover:bg-accent/90 transition-all pointer-events-auto">
                    <ExternalLink size={20} />
                  </a>
                </div>
                
                <p className="text-accent font-semibold mb-4 tracking-widest uppercase text-sm">
                  Featured Project {currentIndex + 1} of {totalProjects}
                </p>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 pr-12">
                  {project.title}
                </h3>
                <p className="text-lg text-foreground/80 leading-relaxed mb-10 max-w-2xl">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-background/80 border border-foreground/10 rounded-xl text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 md:mt-12 px-2">
            <div className="flex gap-2.5">
              {PORTFOLIO_DATA.projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                    i === currentIndex ? "w-10 bg-accent" : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground/5 hover:border-foreground/20 transition-all text-foreground/80 hover:text-foreground"
                aria-label="Previous project"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 hover:border-foreground/20 transition-all text-foreground/80 hover:text-foreground"
                aria-label="Next project"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
