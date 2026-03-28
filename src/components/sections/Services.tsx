"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";

// ─── Service Data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications built with React, Next.js, and Tailwind CSS — from pixel-perfect UI to scalable backend APIs.",
    tags: ["React", "Next.js", "Node.js", "Tailwind CSS", "REST APIs"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    accent: "#3b82f6",
  },
  {
    number: "02",
    title: "Network Infrastructure & IT Support",
    description:
      "LAN/WAN setup, Windows administration, MS Office config, and full helpdesk support for businesses of any size.",
    tags: ["LAN/WAN", "Windows", "MS Office", "Helpdesk"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    accent: "#10b981",
  },
  {
    number: "03",
    title: "Hardware Diagnostics & Repair",
    description:
      "Professional laptop & desktop repair: component replacement, thermal servicing, system upgrades, and custom PC builds.",
    tags: ["Laptop Repair", "PC Assembly", "Upgrades", "Diagnostics"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 000-5.196L8.625 2.748a3.75 3.75 0 00-5.196 0L2.748 3.43a3.75 3.75 0 000 5.196l4.275 4.275" />
      </svg>
    ),
    accent: "#f97316",
  },
  {
    number: "04",
    title: "Cloud & Hosting Solutions",
    description:
      "Website deployment, Hostinger/cPanel management, domain config, SSL setup, and performance optimisation.",
    tags: ["Hostinger", "cPanel", "SSL/DNS", "WordPress"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    accent: "#8b5cf6",
  },
];

const N = SERVICES.length;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Services() {
  // The outer container is tall: heading section + N cards × 100vh + exit buffer
  // The sticky inner pins for exactly that range, then releases for normal scroll.
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;

        // rect.top is negative once we've scrolled past the container's top edge
        const scrolledIn = -el.getBoundingClientRect().top;
        const trackLen = el.offsetHeight - window.innerHeight;

        if (scrolledIn <= 0) { setVisibleCount(0); return; }
        if (scrolledIn >= trackLen) { setVisibleCount(N); return; }

        // Each card gets an equal share of the scroll track
        const count = Math.ceil((scrolledIn / trackLen) * N);
        setVisibleCount(Math.min(count, N));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check in case the page loads mid-way
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="services" className="border-t border-foreground/5">



      {/* ── Scroll Track ─────────────────────────────────────────────────────
          Height = N cards × 100vh gives each card exactly one viewport of scroll.
          After the last card is shown the sticky element un-pins and normal
          page scroll resumes automatically.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ height: `${N * 100}vh` }}
      >
        {/* Sticky viewport — stays on screen while we scroll through the track */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl w-full">

            {/* Heading — inside the pin so no gap above the cards */}
            <div className="mb-8">
              <SplitText
                text="Technical Services"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              />
              <p className="mt-3 text-foreground/50 text-base md:text-lg max-w-xl">
                Scroll to explore what I can build for you.
              </p>
            </div>

            {/* Card stack area */}
            <div className="relative" style={{ height: "min(340px, 52vh)" }}>
              {SERVICES.map((service, i) => {
                const isVisible = i < visibleCount;
                // depth: 0 = topmost visible card, increases for buried cards
                const depth = Math.max(0, visibleCount - 1 - i);

                return (
                  <motion.div
                    key={service.number}
                    // Cards start below the viewport and slide up when revealed
                    initial={{ y: "100vh", opacity: 0 }}
                    animate={
                      isVisible
                        ? {
                            // Slight downward offset per depth level for the "stack" illusion
                            y: depth * 14,
                            scale: 1 - depth * 0.035,
                            opacity: 1 - depth * 0.18,
                          }
                        : { y: "100vh", opacity: 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 28,
                      mass: 0.8,
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: i + 1,          // later cards render on top
                      willChange: "transform",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Glass Card */}
                    <div
                      className="w-full h-full rounded-2xl p-6 md:p-8"
                      style={{
                        background: "rgba(14,14,14,0.95)",
                        border: `1px solid ${service.accent}33`,
                        boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 64px -16px rgba(0,0,0,0.7)`,
                      }}
                    >
                      {/* Subtle top-edge glow strip */}
                      <div
                        className="absolute top-0 left-8 right-8 h-px rounded-full"
                        style={{ background: `${service.accent}55` }}
                      />

                      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start h-full">
                        {/* Icon + Number */}
                        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-4">
                          <div
                            className="p-3 rounded-xl"
                            style={{
                              background: `${service.accent}18`,
                              border: `1px solid ${service.accent}33`,
                              color: service.accent,
                            }}
                          >
                            {service.icon}
                          </div>
                          <span
                            className="text-5xl font-black leading-none select-none"
                            style={{ color: "rgba(255,255,255,0.06)" }}
                          >
                            {service.number}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight"
                            style={{ color: "rgba(255,255,255,0.92)" }}
                          >
                            {service.title}
                          </h3>
                          <p className="text-sm md:text-base leading-relaxed mb-5 text-foreground/55">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  background: `${service.accent}12`,
                                  border: `1px solid ${service.accent}25`,
                                  color: `${service.accent}cc`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i < visibleCount ? 24 : 8,
                    background: i < visibleCount ? s.accent : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom breathing room before next section */}
      <div className="py-16" />
    </section>
  );
}
