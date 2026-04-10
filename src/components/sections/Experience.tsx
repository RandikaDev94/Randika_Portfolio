"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/constants/data";
import { SplitText } from "@/components/ui/SplitText";
import { CheckCircle2 } from "lucide-react";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  descriptions?: string[];
  isLeft: boolean;
}

const TimelineItem = ({ date, title, subtitle, descriptions, isLeft }: TimelineItemProps) => {
  return (
    <div className={`exp-card relative flex items-start w-full mb-12 md:mb-24 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
      
      {/* The dot connector */}
      <div className="absolute left-[24px] md:left-1/2 w-[16px] h-[16px] rounded-full bg-accent border-[4px] border-background z-10 -ml-[8px] mt-8 md:mt-10" />

      {/* Card Wrapper */}
      <div className={`w-full md:w-5/12 pl-[64px] md:pl-0 ${isLeft ? 'md:pr-12 xl:pr-16' : 'md:pl-12 xl:pl-16'}`}>
        <div className="py-6 px-6 md:p-8 rounded-2xl bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-foreground/10 transition-colors w-full group">
          <div className={`flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'items-start text-left'}`}>
            <span className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">{date}</span>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">{title}</h3>
            <h4 className="text-base md:text-lg text-foreground/60 font-medium mb-6">{subtitle}</h4>
            
            {descriptions && descriptions.length > 0 && (
              <ul className={`w-full space-y-4 flex flex-col ${isLeft ? 'md:items-end' : 'items-start'}`}>
                {descriptions.map((desc, i) => (
                  <li key={i} className={`flex items-start gap-4 text-sm md:text-base text-foreground/75 ${isLeft ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}>
                    <CheckCircle2 className="w-5 h-5 text-accent/60 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Ignore mobile re-sizing lag for fixed smooth performance
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      const badges = gsap.utils.toArray<HTMLElement>(".timeline-badge");
      
      [...cards, ...badges].forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 relative border-t border-foreground/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="w-full mb-16 md:mb-24 text-center">
          <SplitText text="Career Journey" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight inline-block" />
        </div>
        
        {/* Unified Timeline Container */}
        <div className="relative w-full">
          {/* Main vertical line */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[2px] bg-foreground/10 -ml-[1px]" />

          {/* Experience Centered Badge */}
          <div className="timeline-badge relative flex justify-start md:justify-center w-full mb-12 md:mb-16 mt-4">
            <div className="ml-[2px] md:ml-0 px-10 py-4 rounded-full bg-background/95 backdrop-blur-md border border-foreground/20 text-accent font-bold z-10 text-sm md:text-base tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Experience
            </div>
          </div>

          {/* Professional Experience Items */}
          {PORTFOLIO_DATA.experience.map((exp, index) => (
            <TimelineItem
              key={`exp-${index}`}
              isLeft={index % 2 === 0}
              date={exp.period}
              title={exp.role}
              subtitle={exp.company}
              descriptions={exp.description}
            />
          ))}

          {/* Education Centered Badge separator */}
          <div className="timeline-badge relative flex justify-start md:justify-center w-full mb-12 md:mb-16 mt-8">
            <div className="ml-[2px] md:ml-0 px-10 py-4 rounded-full bg-background/95 backdrop-blur-md border border-foreground/20 text-accent font-bold z-10 text-sm md:text-base tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Education
            </div>
          </div>

          {/* Education Items */}
          {PORTFOLIO_DATA.education.map((edu, index) => (
            <TimelineItem
              key={`edu-${index}`}
              // Continuing the sequence from the last index to keep the alternation smooth
              isLeft={(PORTFOLIO_DATA.experience.length + index) % 2 === 0}
              date={`Graduated ${edu.year}`}
              title={edu.degree}
              subtitle={edu.institution}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
