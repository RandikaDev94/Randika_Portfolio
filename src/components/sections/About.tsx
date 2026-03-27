"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 relative border-t border-foreground/5 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Animated Header */}
        <SplitText text="About Me" className="text-3xl md:text-5xl font-bold mb-8 md:mb-10 text-center" />

        {/* Seamless Framer Motion Paragraph Reveal (Zero GSAP conflict lag) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-4xl text-center"
        >
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
            I am a detail-oriented IT professional based in Sri Lanka with over 5 years of experience spanning software development, web design, and comprehensive IT support. Dedicated to bridging the gap between hardware infrastructure and software architecture, I specialize in creating user-focused digital solutions and optimizing deep technical processes.
          </p>

        </motion.div>
      </div>
    </section>
  );
}
