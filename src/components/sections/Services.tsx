"use client";

import { motion } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";

const SERVICES = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications built with React, Next.js, and Tailwind CSS. From pixel-perfect UI design to scalable backend APIs — I build digital products that perform and convert.",
    tags: ["React", "Next.js", "Node.js", "Tailwind CSS", "REST APIs"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    gradientFrom: "rgba(59,130,246,0.15)",
    gradientTo:   "rgba(6,182,212,0.06)",
    borderColor:  "rgba(59,130,246,0.25)",
    iconBg:       "rgba(59,130,246,0.12)",
  },
  {
    number: "02",
    title: "Network Infrastructure & IT Support",
    description:
      "LAN/WAN network setup, maintenance, and troubleshooting. Full Windows administration, MS Office configuration, and day-to-day helpdesk support for businesses of any size.",
    tags: ["LAN/WAN", "Windows Server", "MS Office", "Helpdesk"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    gradientFrom: "rgba(16,185,129,0.15)",
    gradientTo:   "rgba(20,184,166,0.06)",
    borderColor:  "rgba(16,185,129,0.25)",
    iconBg:       "rgba(16,185,129,0.12)",
  },
  {
    number: "03",
    title: "Hardware Diagnostics & Repair",
    description:
      "Professional laptop and desktop repair: component replacement, thermal servicing, and performance upgrades. I also assemble custom PC builds from scratch.",
    tags: ["Laptop Repair", "PC Assembly", "Upgrades", "Diagnostics"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 000-5.196L8.625 2.748a3.75 3.75 0 00-5.196 0L2.748 3.43a3.75 3.75 0 000 5.196l4.275 4.275" />
      </svg>
    ),
    gradientFrom: "rgba(249,115,22,0.15)",
    gradientTo:   "rgba(234,179,8,0.06)",
    borderColor:  "rgba(249,115,22,0.25)",
    iconBg:       "rgba(249,115,22,0.12)",
  },
  {
    number: "04",
    title: "Cloud & Hosting Solutions",
    description:
      "Website deployment, cPanel/Hostinger hosting management, domain configuration, SSL setup, and performance optimisation. Keeping your digital presence fast, secure, and always online.",
    tags: ["Hostinger", "cPanel", "SSL/DNS", "WordPress", "Deployment"],
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    gradientFrom: "rgba(139,92,246,0.15)",
    gradientTo:   "rgba(168,85,247,0.06)",
    borderColor:  "rgba(139,92,246,0.25)",
    iconBg:       "rgba(139,92,246,0.12)",
  },
];

// Each card gets a progressively deeper sticky offset so they
// peek from behind the card above them as you scroll.
const STICKY_TOP_BASE = 72; // px — clears the fixed header
const STACK_PEEK = 20;      // px — how much of the card above remains visible

export default function Services() {
  return (
    <section id="services" className="py-20 relative border-t border-foreground/5">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Heading */}
        <div className="w-full mb-16">
          <SplitText
            text="Technical Services"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-foreground/50 text-base md:text-lg max-w-xl"
          >
            Scroll to explore what I can build for you.
          </motion.p>
        </div>

        {/* Sticky Card Stack
            Each card is position:sticky so the browser handles
            the stacking entirely on the compositor thread — zero JS math. */}
        <div className="relative">
          {SERVICES.map((service, i) => {
            const stickyTop = STICKY_TOP_BASE + i * STACK_PEEK;

            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  // stagger between cards
                  delay: 0,
                }}
                // Sticky is applied via inline style — Tailwind can't do dynamic values
                style={{
                  position: "sticky",
                  top: stickyTop,
                  zIndex: 10 + i,
                  // Required for 120fps promotion
                  willChange: "transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  marginBottom: i < SERVICES.length - 1 ? "1.5rem" : 0,
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    // Solid dark background (no expensive backdrop-filter)
                    background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo}), rgba(14, 14, 14, 0.96)`,
                    border: `1px solid ${service.borderColor}`,
                    boxShadow: "0 20px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
                  }}
                >
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">

                      {/* Icon + Number */}
                      <div className="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-start gap-4">
                        <div
                          className="p-3 rounded-xl"
                          style={{
                            background: service.iconBg,
                            border: `1px solid ${service.borderColor}`,
                            color: "hsl(var(--accent))",
                          }}
                        >
                          {service.icon}
                        </div>
                        <span
                          className="text-6xl font-black leading-none select-none"
                          style={{ color: "rgba(255,255,255,0.06)" }}
                        >
                          {service.number}
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-5">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.09)",
                                color: "rgba(255,255,255,0.55)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Bottom spacer so the last card un-pins cleanly */}
          <div style={{ height: "50vh" }} />
        </div>

      </div>
    </section>
  );
}
