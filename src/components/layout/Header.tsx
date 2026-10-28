"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/constants/data";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Award } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const lenis = useLenis();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Make sure mobile menu closes on click
    
    if (lenis) {
      // Use Lenis buttery smooth scroll engine
      lenis.scrollTo(target, {
        duration: 1.2,
        offset: 0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    } else {
      // Fallback for native standard
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 will-change-[background-color,backdrop-filter] [transform:translateZ(0)] [backface-visibility:hidden] transition-all duration-200 ease-in-out border-b ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-white/5" : "bg-transparent border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 h-14 md:h-20 flex items-center justify-between relative">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="text-2xl font-bold tracking-tighter cursor-pointer z-10 shrink-0">
          RW<span className="text-accent">.</span>
        </a>

        {/* Desktop Nav - Centered in Window */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Social & Hot Button */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-5 z-10 shrink-0">
          <div className="hidden lg:flex items-center space-x-3.5 pr-4 border-r border-foreground/10">
            <Link href={PORTFOLIO_DATA.socialLinks.linkedin} target="_blank" className="group p-1" aria-label="LinkedIn">
              <div className="w-4 h-4 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/linkedin.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            </Link>
            <Link href={PORTFOLIO_DATA.socialLinks.github} target="_blank" className="group p-1" aria-label="GitHub">
              <div className="w-4 h-4 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/github.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            </Link>
            <Link href={PORTFOLIO_DATA.socialLinks.facebook} target="_blank" className="group p-1" aria-label="Facebook">
              <div className="w-4 h-4 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/facebook.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            </Link>
            <Link href={PORTFOLIO_DATA.socialLinks.instagram} target="_blank" className="group p-1" aria-label="Instagram">
              <div className="w-4 h-4 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/instagram.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            </Link>
          </div>

          {/* Hot Button to Certificates Section */}
          <a
            href="#certificates"
            onClick={(e) => handleScrollTo(e, "#certificates")}
            className="relative group inline-flex items-center gap-2 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 bg-gradient-to-r from-accent/15 via-accent/25 to-accent/15 hover:from-accent hover:to-accent text-accent hover:text-white border border-accent/40 hover:border-accent shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent group-hover:bg-white"></span>
            </span>
            <Award className="w-3.5 h-3.5" />
            <span>Certificates</span>
          </a>
        </div>

        {/* Mobile Right Controls */}
        <div className="flex md:hidden items-center gap-2.5">
          {/* Mobile Hot Button to Certificates */}
          <a
            href="#certificates"
            onClick={(e) => handleScrollTo(e, "#certificates")}
            className="relative group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide bg-gradient-to-r from-accent/20 to-accent/10 hover:from-accent hover:to-accent text-accent hover:text-white border border-accent/35 hover:border-accent shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all cursor-pointer"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent group-hover:bg-white"></span>
            </span>
            <Award className="w-3 h-3" />
            <span>Certificates</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="text-foreground hover:text-accent transition-colors p-1"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <div className="w-7 h-7 bg-foreground group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/nav/close.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            ) : (
              <div className="w-7 h-7 bg-foreground group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/nav/menu.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-foreground/10 overflow-hidden"
          >
            <div className="flex flex-col items-center py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-lg font-medium text-foreground/80 hover:text-accent transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Menu Featured Hot Button */}
              <a
                href="#certificates"
                onClick={(e) => handleScrollTo(e, "#certificates")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer my-2"
              >
                <Award className="w-4 h-4" />
                <span>View Verified Certificates</span>
              </a>

              <div className="flex items-center space-x-6 pt-4 border-t border-foreground/10 w-full justify-center">
                <Link href={PORTFOLIO_DATA.socialLinks.linkedin} target="_blank" className="group p-2" aria-label="LinkedIn">
                  <div className="w-6 h-6 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/linkedin.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.github} target="_blank" className="group p-2" aria-label="GitHub">
                  <div className="w-6 h-6 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/github.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.facebook} target="_blank" className="group p-2" aria-label="Facebook">
                  <div className="w-6 h-6 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/facebook.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.instagram} target="_blank" className="group p-2" aria-label="Instagram">
                  <div className="w-6 h-6 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/instagram.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
