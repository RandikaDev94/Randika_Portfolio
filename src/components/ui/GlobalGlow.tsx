"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalGlow() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10vh", "30vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["50vh", "10vh"]);

  const bg1 = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.07) 40%, rgba(59, 130, 246, 0) 70%)", // Blue
      "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.05) 40%, rgba(16, 185, 129, 0) 70%)", // Emerald
    ]
  );

  const bg2 = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.07) 40%, rgba(168, 85, 247, 0) 70%)", // Purple
      "radial-gradient(circle, rgba(8, 145, 178, 0.12) 0%, rgba(8, 145, 178, 0.05) 40%, rgba(8, 145, 178, 0) 70%)",  // Cyan
    ]
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-50] pointer-events-none bg-[#06070a] overflow-hidden">
      
      {/* DESKTOP ONLY: Dynamic Scroll-tracking Orbs */}
      <motion.div 
        style={{ y: y1, background: bg1 }}
        className="hidden md:block absolute md:-left-[20vw] md:top-[-20vh] md:w-[100vw] md:h-[100vw] mix-blend-screen"
      />
      <motion.div 
        style={{ y: y2, background: bg2 }}
        className="hidden md:block absolute md:-right-[20vw] md:-top-[10vh] md:w-[100vw] md:h-[100vw] mix-blend-screen"
      />

      {/* MOBILE ONLY: Strictly Static Orbs (Completely prevents all scroll lag on phones!) */}
      <div 
        className="md:hidden absolute -left-[50vw] top-[-30vh] w-[200vw] h-[200vw] mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.07) 40%, rgba(59, 130, 246, 0) 70%)" }}
      />
      <div 
        className="md:hidden absolute -right-[50vw] top-[20vh] w-[200vw] h-[200vw] mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.07) 40%, rgba(168, 85, 247, 0) 70%)" }}
      />

      {/* Central flat space glow (virtually invisible) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_100%)] pointer-events-none mix-blend-screen" />
    </div>
  );
}
