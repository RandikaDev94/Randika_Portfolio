"use client";

import { useRef } from "react";
import { PORTFOLIO_DATA } from "@/constants/data";
import { motion, Variants } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";

const getIcon = (iconName: string) => {
  const devicons: Record<string, string> = {
    html5: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    css3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    wordpress: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg",
    flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  };

  if (devicons[iconName]) {
    return <img src={devicons[iconName]} alt={iconName} className={`w-8 h-8 ${iconName === 'nextjs' || iconName === 'wordpress' ? 'invert opacity-90' : ''}`} />;
  }

  // Fallback inline SVGs for Non-devicon IT skills
  switch (iconName) {
    case "support":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "hardware":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <rect width="18" height="12" x="3" y="4" rx="2" />
          <path d="M2 20h20" />
          <path d="M12 16v4" />
        </svg>
      );
    case "network":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
          <rect x="16" y="16" width="6" height="6" rx="1" />
          <rect x="2" y="16" width="6" height="6" rx="1" />
          <rect x="9" y="2" width="6" height="6" rx="1" />
          <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
          <path d="M12 12V8" />
        </svg>
      );
    case "printer":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect width="12" height="8" x="6" y="14" />
        </svg>
      );
    default:
      return (
        <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-accent font-bold">
          {iconName.charAt(0).toUpperCase()}
        </div>
      );
  }
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  // Animation variants setup strictly typed as Variants to avoid TS compiler errors
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="skills" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden flex flex-col items-center">
      <div className="container mx-auto px-6 z-10 relative mb-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-start mb-16"
        >
          <SplitText text="Tools & Expertise" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" />
          <p className="text-foreground/60 max-w-2xl text-lg md:text-xl">
            Technologies I actively use to engineer and deliver high-performance digital experiences.
          </p>
        </motion.div>

        {/* Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {PORTFOLIO_DATA.skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              className="bg-[#0b0c10] border border-foreground/5 rounded-2xl md:rounded-[1.5rem] p-4 sm:p-5 md:p-6 flex flex-col shadow-lg hover:border-foreground/15 hover:bg-[#0e0f14] transition-colors group"
            >
              <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 bg-background/50 rounded-xl group-hover:bg-background transition-colors shadow-sm border border-foreground/5 shrink-0">
                  {getIcon(skill.icon)}
                </div>
                <h3 className="text-sm sm:text-base md:text-xl font-bold tracking-tight leading-snug">{skill.name}</h3>
              </div>

              <div className="w-full mt-auto pt-6 sm:pt-8 flex flex-col justify-end">
                <div className="flex justify-end mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-sm font-bold tracking-wider">{skill.percentage}%</span>
                </div>
                {/* Progress bar track */}
                <div className="w-full h-[3px] sm:h-1 bg-foreground/10 flex overflow-hidden rounded-full">
                  {/* Progress bar fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-foreground/90 relative rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
