"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/constants/data";
import { SplitText } from "@/components/ui/SplitText";
import { CheckCircle2, Award, Download, ExternalLink, FolderDown, GraduationCap, Briefcase } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categoryOptions = [
    { id: "All", label: "All Credentials", count: PORTFOLIO_DATA.certificates?.length || 0 },
    { id: "Educational Qualification", label: "Education", count: PORTFOLIO_DATA.certificates?.filter(c => c.category === "Educational Qualification").length || 0 },
    { id: "Other Qualification", label: "Other Qualifications", count: PORTFOLIO_DATA.certificates?.filter(c => c.category === "Other Qualification").length || 0 },
    { id: "Service Letter", label: "Service Letters", count: PORTFOLIO_DATA.certificates?.filter(c => c.category === "Service Letter").length || 0 },
  ];

  const filteredCertificates = PORTFOLIO_DATA.certificates
    ? activeCategory === "All"
      ? PORTFOLIO_DATA.certificates
      : PORTFOLIO_DATA.certificates.filter((c) => c.category === activeCategory)
    : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Educational Qualification":
        return <GraduationCap className="w-4 h-4 text-accent" />;
      case "Service Letter":
        return <Briefcase className="w-4 h-4 text-accent" />;
      default:
        return <Award className="w-4 h-4 text-accent" />;
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Ignore mobile re-sizing lag for fixed smooth performance
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      const badges = gsap.utils.toArray<HTMLElement>(".timeline-badge");
      const certCards = gsap.utils.toArray<HTMLElement>(".cert-card");
      
      [...cards, ...badges, ...certCards].forEach((el) => {
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

          {/* Timeline termination dot */}
          <div className="absolute left-[24px] md:left-1/2 bottom-0 w-[12px] h-[12px] rounded-full bg-accent/60 border-2 border-background z-10 -ml-[6px]" />
        </div>

        {/* Certificates & Credentials Section */}
        {PORTFOLIO_DATA.certificates && PORTFOLIO_DATA.certificates.length > 0 && (
          <div className="mt-20 md:mt-28 w-full pt-16 border-t border-foreground/10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Qualifications</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                Certificates & Diplomas
              </h3>
              <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                Official academic degrees, technical diplomas, and certified training validating hands-on expertise.
              </p>
            </div>

            {/* Master Download All Banner */}
            {PORTFOLIO_DATA.certificateBundle && (
              <div className="cert-card mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-foreground/[0.03] to-accent/5 border border-accent/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="p-3.5 rounded-xl bg-accent/15 border border-accent/30 text-accent shrink-0 hidden sm:flex">
                    <FolderDown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-foreground mb-1">
                      Complete Credential Dossier
                    </h4>
                    <p className="text-xs md:text-sm text-foreground/60">
                      Download all verified certificates and academic documents in a single package.
                    </p>
                  </div>
                </div>

                <a
                  href={PORTFOLIO_DATA.certificateBundle}
                  download="Randika_Wijesooriya_Certificates.zip"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] shrink-0 group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download All (.ZIP)</span>
                </a>
              </div>
            )}

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
              {categoryOptions.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-105"
                        : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground border border-foreground/10"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Individual Certificate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {filteredCertificates.map((cert, idx) => (
                <div
                  key={`cert-${cert.title}-${idx}`}
                  className="cert-card p-6 md:p-7 rounded-2xl bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-accent/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
                        {getCategoryIcon(cert.category)}
                        <span>{cert.category}</span>
                      </span>
                      <span className="text-xs text-foreground/40 font-medium">
                        {cert.year}
                      </span>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-xs md:text-sm text-foreground/60 font-medium mb-6">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-foreground/5">
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground border border-foreground/10 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                    <a
                      href={cert.file}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 hover:border-accent transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
