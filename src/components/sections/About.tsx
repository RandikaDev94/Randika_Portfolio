"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/constants/data";
import { SplitText } from "@/components/ui/SplitText";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative border-t border-foreground/5 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <SplitText text="About Me" className="text-3xl md:text-5xl font-bold mb-10 text-center" />
        
        <div ref={textRef} className="max-w-4xl text-center">
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6">
            I am a detail-oriented IT professional based in Sri Lanka with over 5 years of experience spanning software development, web design, and comprehensive IT support. Dedicated to bridging the gap between hardware infrastructure and software architecture, I specialize in creating user-focused digital solutions and optimizing deep technical processes.
          </p>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            Adept at leveraging both technical expertise and interpersonal skills, my goal is to consistently deliver impactful, performance-optimized projects that drive business success—whether I'm configuring robust office networks or crafting seamless Next.js modern web interfaces.
          </p>
        </div>
      </div>
    </section>
  );
}
