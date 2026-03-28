"use client";

import { motion } from "framer-motion";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import { SplitText } from "@/components/ui/SplitText";

const SERVICES = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications built with React, Next.js, and Tailwind CSS. From pixel-perfect UI design to scalable backend APIs — I build digital products that perform and convert.",
    tags: ["React", "Next.js", "Node.js", "Tailwind CSS", "REST APIs"],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    accentColor: "from-blue-500/20 to-cyan-500/10",
    borderAccent: "border-blue-500/30",
  },
  {
    number: "02",
    title: "Network Infrastructure & IT Support",
    description:
      "LAN/WAN network setup, maintenance, and troubleshooting. Full Windows administration, Active Directory, MS Office configuration, and day-to-day helpdesk support for businesses of any size.",
    tags: ["LAN/WAN", "Windows Server", "MS Office", "Helpdesk", "Active Directory"],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    accentColor: "from-emerald-500/20 to-teal-500/10",
    borderAccent: "border-emerald-500/30",
  },
  {
    number: "03",
    title: "Hardware Diagnostics & Repair",
    description:
      "Professional laptop and desktop repair: motherboard-level diagnostics, component replacement, thermal servicing, and performance upgrades. I also assemble custom PC builds from scratch.",
    tags: ["Laptop Repair", "PC Assembly", "Component Upgrades", "Data Recovery", "Diagnostics"],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 000-5.196L8.625 2.748a3.75 3.75 0 00-5.196 0L2.748 3.43a3.75 3.75 0 000 5.196l4.275 4.275" />
      </svg>
    ),
    accentColor: "from-orange-500/20 to-amber-500/10",
    borderAccent: "border-orange-500/30",
  },
  {
    number: "04",
    title: "Cloud & Hosting Solutions",
    description:
      "Website deployment, cPanel/Hostinger hosting management, domain configuration, SSL setup, and performance optimization. Keeping your digital presence fast, secure, and always online.",
    tags: ["Hostinger", "cPanel", "SSL/DNS", "WordPress", "Deployment"],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    accentColor: "from-violet-500/20 to-purple-500/10",
    borderAccent: "border-violet-500/30",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 relative border-t border-foreground/5">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Section Heading */}
        <div className="w-full mb-16">
          <SplitText
            text="Technical Services"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 text-foreground/50 text-lg max-w-xl"
          >
            Scroll to explore what I can build for you.
          </motion.p>
        </div>

        {/* ScrollStack Cards */}
        <ScrollStack
          useWindowScroll={true}
          itemDistance={80}
          itemStackDistance={16}
          stackPosition="15%"
          scaleEndPosition="8%"
          baseScale={0.88}
          itemScale={0.03}
        >
          {SERVICES.map((service) => (
            <ScrollStackItem key={service.number}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

                {/* Left: Number + Icon */}
                <div className="flex-shrink-0 flex flex-col items-start gap-4">
                  <span className="text-5xl font-black text-foreground/10 leading-none select-none">
                    {service.number}
                  </span>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${service.accentColor} border ${service.borderAccent} text-accent`}>
                    {service.icon}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-foreground/60 text-base md:text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>

      </div>
    </section>
  );
}
