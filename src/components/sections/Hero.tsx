"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA } from "@/constants/data";
import React, { useEffect, useState } from "react";
import { SplitText } from "@/components/ui/SplitText";

const roleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.8 + i * 0.2,
      duration: 0.6,
      ease: "backOut",
    },
  }),
};

export default function Hero() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(hover: none)").matches);
    }
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Explicitly bypass physics tracking on touch devices to save massive mobile battery/CPU
    if (isTouchDevice) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    x.set(0);
    y.set(0);
  };

  // Adjusted positions to fit natively on mobile screens without huge overflow 
  // while expanding firmly off the edges on desktop via sm: classes
  const badgePositions = [
    "top-8 sm:top-16 -left-6 sm:left-0 sm:-translate-x-1/2",
    "top-1/2 -right-6 sm:right-0 sm:translate-x-1/2 -translate-y-1/2",
    "bottom-8 sm:bottom-16 -left-6 sm:left-0 sm:-translate-x-1/2",
  ];

  return (
    <section id="home" className="min-h-[100dvh] relative flex items-center justify-center overflow-hidden pt-20 lg:pt-0 pb-16 lg:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 z-0" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 items-center h-full">

        {/* === MOBILE FIRST: Name Headings (120Hz Optimized, No SplitText) === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 w-full text-center flex flex-col lg:hidden mb-4 will-change-[opacity]"
        >
          <h2 className="text-xl sm:text-2xl font-medium text-accent mb-1 uppercase tracking-wider">I AM</h2>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{PORTFOLIO_DATA.name}</h1>
        </motion.div>

        {/* === RIGHT COLUMN / MOBILE MIDDLE: Image & Badges === */}
        <motion.div
          initial={{ opacity: 0, scale: isTouchDevice ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="order-2 lg:order-2 lg:col-start-2 lg:row-start-1 relative flex flex-col justify-center items-center lg:justify-end w-full"
          style={isTouchDevice ? {} : { perspective: 1200 }}
        >
          {/* Layout Wrapper for Image & Border Badges */}
          <div className="relative w-[14rem] h-[20rem] sm:w-[20rem] sm:h-[28rem] lg:w-[26rem] lg:h-[36rem] xl:w-[30rem] xl:h-[42rem]">

            {/* Ambient Bobbing Wrapper */}
            <motion.div
              animate={{ y: isTouchDevice ? [-5, 5, -5] : [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 will-change-transform [transform:translateZ(0)]"
            >
              {/* DESKTOP ONLY: 3D Interactive Card (Requires Heavy GPU Compositing) */}
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="hidden lg:block absolute inset-0 rounded-[2.5rem] overflow-visible z-10 touch-none peer"
              >
                {/* Backglow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  style={{ transform: "translateZ(-30px)" }}
                  className="absolute -inset-4 md:-inset-8 rounded-[3rem] bg-accent/40 blur-[40px] md:blur-[70px] -z-10"
                />

                {/* Glass Card */}
                <motion.div
                  style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                  className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-background/60 bg-accent/10 backdrop-blur-md"
                >
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-40"
                    style={{
                      background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                      x: glareX, y: glareY, left: "-50%", top: "-50%", width: "200%", height: "200%"
                    }}
                  />
                  <div className="relative w-full h-full">
                    <img
                      src="/profile.webp"
                      alt={PORTFOLIO_DATA.name}
                      className="object-cover object-center w-full h-full pointer-events-none select-none transition-transform duration-700 ease-out hover:scale-105 will-change-transform [transform:translateZ(0)]"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=Randika+Wijesooriya&size=800&background=0a0a0a&color=3b82f6&font-size=0.33`;
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* MOBILE ONLY: 2D Flat Card (100% smooth scrolling, zero 3D physics lag) */}
              <div className="block lg:hidden absolute inset-0 rounded-[2.5rem] overflow-visible z-10">
                {/* Static Flat Backglow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute -inset-4 rounded-[3rem] bg-accent/40 blur-[40px] -z-10 will-change-[opacity]"
                />

                {/* Flat Glass Card (No Glare, No 3D transform styles) */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-background/60 bg-accent/10 backdrop-blur-sm">
                  <div className="relative w-full h-full">
                    <img
                      src="/profile.webp"
                      alt={PORTFOLIO_DATA.name}
                      className="object-cover object-center w-full h-full pointer-events-none select-none will-change-transform [transform:translateZ(0)]"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=Randika+Wijesooriya&size=800&background=0a0a0a&color=3b82f6&font-size=0.33`;
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DESKTOP Badges (Scale/Ease mechanics) */}
            {PORTFOLIO_DATA.roles.map((role, i) => (
              <motion.div
                key={`desk-badge-${role}`}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={roleVariants}
                className={`hidden lg:block absolute ${badgePositions[i] || ""} z-50 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-3xl saturate-150 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] pointer-events-none whitespace-nowrap will-change-transform [transform:translateZ(0)]`}
              >
                <h3 className="text-lg font-bold text-foreground/90 drop-shadow-md tracking-wide">{role}</h3>
              </motion.div>
            ))}

            {/* MOBILE Badges (120Hz Optimized: Opacity fading ONLY, no spatial scaling) */}
            {PORTFOLIO_DATA.roles.map((role, i) => (
              <motion.div
                key={`mob-badge-${role}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                className={`block lg:hidden absolute ${badgePositions[i] || ""} z-50 bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-4 backdrop-blur-3xl saturate-150 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] pointer-events-none whitespace-nowrap will-change-[opacity,transform] [transform:translateZ(0)]`}
              >
                <h3 className="text-[10px] sm:text-sm font-bold text-foreground/90 drop-shadow-md tracking-wide">{role}</h3>
              </motion.div>
            ))}
          </div>

          {/* MOBILE ONLY: The Availability Badge placed directly under the image tags! */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex lg:hidden justify-center mt-10 mb-4 z-50 w-full relative will-change-[opacity]"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm shadow-lg shadow-accent/5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent"></span>
              </span>
              <span className="text-sm font-semibold text-accent tracking-wide uppercase">Available for Freelance</span>
            </div>
          </motion.div>

        </motion.div>

        {/* === LEFT COLUMN / MOBILE BOTTOM: Desktop Titles, Metrics, Buttons === */}
        <div className="order-3 lg:order-1 lg:col-start-1 lg:row-start-1 w-full text-center lg:text-left flex flex-col justify-center mt-6 lg:mt-0">

          {/* DESKTOP ONLY: Freelance Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex justify-start mb-8 will-change-transform [transform:translateZ(0)]"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm shadow-lg shadow-accent/5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent"></span>
              </span>
              <span className="text-sm font-semibold text-accent tracking-wide uppercase">Available for Freelance</span>
            </div>
          </motion.div>

          {/* DESKTOP ONLY: Name Headings */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col will-change-transform [transform:translateZ(0)]"
          >
            <SplitText text="I AM" elementType="h2" className="text-5xl font-medium text-accent mb-4 uppercase tracking-wider" />
            <SplitText text={PORTFOLIO_DATA.name} elementType="h1" delay={0.2} className="text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold tracking-tight" />
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: isTouchDevice ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 lg:mt-10 mb-2 will-change-[transform,opacity] [transform:translateZ(0)]"
          >
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-3xl sm:text-4xl font-bold text-foreground">5<span className="text-accent">+</span></p>
              <p className="text-xs sm:text-sm text-foreground/60 font-semibold tracking-wider uppercase mt-1">Years Exp.</p>
            </div>
            <div className="w-[1px] h-14 bg-foreground/10 hidden sm:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-3xl sm:text-4xl font-bold text-foreground">20<span className="text-accent">+</span></p>
              <p className="text-xs sm:text-sm text-foreground/60 font-semibold tracking-wider uppercase mt-1">Projects</p>
            </div>
            <div className="w-[1px] h-14 bg-foreground/10 hidden sm:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-3xl sm:text-4xl font-bold text-foreground">100<span className="text-accent">%</span></p>
              <p className="text-xs sm:text-sm text-foreground/60 font-semibold tracking-wider uppercase mt-1">Client Focus</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: isTouchDevice ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-12 z-20 will-change-[transform,opacity] [transform:translateZ(0)]"
          >
            <a href="#projects" className="bg-accent text-white px-8 py-3.5 lg:py-4 rounded-full font-semibold hover:bg-accent/80 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-base lg:text-lg">
              View Work
            </a>
            <a href="#contact" className="border border-foreground/20 bg-background/50 backdrop-blur-md px-8 py-3.5 lg:py-4 rounded-full font-semibold hover:bg-foreground/5 hover:border-foreground/40 transition-colors text-base lg:text-lg">
              Contact Me
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
