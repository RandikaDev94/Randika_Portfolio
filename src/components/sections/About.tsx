"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { SplitText } from "@/components/ui/SplitText";

// ─── Animated Orb Ring ────────────────────────────────────────────────────────
// Draws three slowly-rotating gradient arcs around the profile image.
// Uses useAnimationFrame so the rotation is driven by the rAF loop (GPU-composited).

function OrbRings() {
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const t = useRef(0);

  useAnimationFrame((_, delta) => {
    t.current += delta * 0.001; // ~1 full rotation per ~6 seconds at 60fps
    if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${t.current * 22}deg) translateZ(0)`;
    if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${-t.current * 14}deg) translateZ(0)`;
    if (ring3Ref.current) ring3Ref.current.style.transform = `rotate(${t.current * 9}deg) translateZ(0)`;
  });

  const ringBase =
    "absolute rounded-full border border-transparent will-change-transform";

  return (
    <>
      {/* Outer pulsing ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.35) 0%, transparent 70%)",
          filter: "blur(28px)",
          transform: "scale(1.3)",
        }}
      />

      {/* Ring 1 — blue arc, fast CW */}
      <div
        ref={ring1Ref}
        className={`${ringBase} inset-[-20px]`}
        style={{
          background:
            "conic-gradient(from 0deg, transparent 60%, rgba(59,130,246,0.8) 80%, rgba(99,179,237,1) 90%, transparent 100%)",
          borderRadius: "50%",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
        }}
      />

      {/* Ring 2 — violet arc, CCW */}
      <div
        ref={ring2Ref}
        className={`${ringBase} inset-[-36px]`}
        style={{
          background:
            "conic-gradient(from 180deg, transparent 50%, rgba(139,92,246,0.7) 75%, rgba(192,132,252,0.9) 88%, transparent 100%)",
          borderRadius: "50%",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
        }}
      />

      {/* Ring 3 — cyan arc, slow CW */}
      <div
        ref={ring3Ref}
        className={`${ringBase} inset-[-54px]`}
        style={{
          background:
            "conic-gradient(from 90deg, transparent 70%, rgba(6,182,212,0.6) 85%, rgba(56,189,248,0.85) 93%, transparent 100%)",
          borderRadius: "50%",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 1px))",
        }}
      />

      {/* Floating sparkle dots */}
      {[
        { top: "10%", left: "-8%", delay: 0,   color: "rgba(59,130,246,0.9)" },
        { top: "80%", left: "108%", delay: 1.2, color: "rgba(139,92,246,0.9)" },
        { top: "50%", left: "-10%", delay: 2.4, color: "rgba(6,182,212,0.9)" },
        { top: "20%", left: "105%", delay: 0.8, color: "rgba(248,113,113,0.9)" },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ top: dot.top, left: dot.left, background: dot.color, willChange: "transform, opacity" }}
          animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
        />
      ))}
    </>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="py-20 md:py-28 relative border-t border-foreground/5 overflow-hidden"
    >
      <div className="w-full px-6 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── LEFT: Image with Orb Effect ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex items-center justify-start"
          >
            {/* Orb container — perfectly circular */}
            <div className="relative" style={{ width: "clamp(280px, 38vw, 480px)", height: "clamp(280px, 38vw, 480px)" }}>
              <OrbRings />

              {/* Profile image — circular */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: "rgba(14,14,14,0.9)",
                  border: "2px solid rgba(59,130,246,0.3)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.06) inset, 0 32px 80px -20px rgba(0,0,0,0.8)",
                }}
              >
                <img
                  src="/profile.webp"
                  alt="Randika Wijesooriya"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center"
                  style={{ willChange: "transform", transform: "translateZ(0)" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=Randika+Wijesooriya&size=600&background=0a0a0a&color=3b82f6&font-size=0.33";
                  }}
                />
                {/* Bottom gradient to soften the circle edge */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at bottom, rgba(0,0,0,0.45) 0%, transparent 60%)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Text Content ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <SplitText
              text="About Me"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            />

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="space-y-5"
            >
              <p className="text-base sm:text-lg text-foreground/75 leading-relaxed">
                I am a detail-oriented IT professional based in Sri Lanka with over{" "}
                <span className="text-accent font-semibold">5 years of experience</span> spanning
                software development, web design, and comprehensive IT support. Dedicated to
                bridging the gap between hardware infrastructure and software architecture, I
                specialize in creating user-focused digital solutions and optimizing deep technical
                processes.
              </p>
              <p className="text-base sm:text-lg text-foreground/75 leading-relaxed">
                Adept at leveraging both technical expertise and interpersonal skills, my goal is
                to consistently deliver impactful, performance-optimized projects that drive
                business success — whether I'm configuring robust office networks or crafting
                seamless{" "}
                <span className="text-accent font-semibold">Next.js modern web interfaces</span>.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
