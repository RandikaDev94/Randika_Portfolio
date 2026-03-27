"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/constants/data";
import { SplitText } from "@/components/ui/SplitText";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 relative border-t border-foreground/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="w-full mb-16">
          <SplitText text="Experience & Education" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-16 lg:space-y-24">
          {/* Experience Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-4 border-b border-foreground/10 pb-4">
              <span className="w-8 h-[2px] bg-accent"></span> Professional Experience
            </h3>
            {PORTFOLIO_DATA.experience.map((exp, index) => (
              <div
                key={`exp-${index}`}
                className="exp-card relative p-8 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                  <h4 className="text-xl text-accent font-medium mt-1">{exp.company}</h4>
                </div>
                
                <div className="mb-4 px-4 py-1.5 rounded-full bg-foreground/10 w-max text-sm font-semibold">
                  {exp.period}
                </div>
                
                <ul className="space-y-3">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start text-foreground/80">
                      <span className="text-accent mr-3 mt-1.5 opacity-80 h-1.5 w-1.5 rounded-full shrink-0 bg-accent" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education Column */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-4 border-b border-foreground/10 pb-4">
              <span className="w-8 h-[2px] bg-accent"></span> Academic Background
            </h3>
            {PORTFOLIO_DATA.education.map((edu, index) => (
              <div
                key={`edu-${index}`}
                className="exp-card relative p-8 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{edu.degree}</h3>
                  <h4 className="text-xl text-accent font-medium mt-1">{edu.institution}</h4>
                </div>
                
                <div className="mt-2 px-4 py-1.5 rounded-full bg-foreground/10 w-max text-sm font-semibold">
                  Graduated {edu.year}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
