"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force browser to always start at the absolute top of the page on a hard refresh
    // This prevents the progressive "creeping down" bug after multiple reloads
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    // Lock scrolling while the preloader is intensely blocking the screen
    document.body.style.overflow = "hidden";
    
    // Unveil the app gracefully after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
      window.scrollTo(0, 0); // Guarantee we drop them firmly at the top of the timeline
    }, 2000); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? "auto" : "none" }}
      transition={{ duration: 1, ease: "easeInOut" }} 
      className="fixed inset-0 z-[100] bg-[#06070a] flex flex-col items-center justify-center transform-gpu"
    >
      <div className="flex flex-col items-center overflow-hidden">
        {/* Animated Brand Reveal */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ 
            y: isLoading ? 0 : -40, 
            opacity: isLoading ? 1 : 0 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center"
        >
          <span className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            RW<span className="text-accent">.</span>
          </span>
        </motion.div>

        {/* Loading Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isLoading ? "200px" : "0px", 
            opacity: isLoading ? 1 : 0 
          }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
          className="h-[3px] bg-accent mt-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        />
      </div>
    </motion.div>
  );
}
