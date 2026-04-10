"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/constants/data";
import Link from "next/link";
import { useLenis } from "lenis/react";

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
      <div className="container mx-auto px-6 h-14 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="text-2xl font-bold tracking-tighter cursor-pointer">
          RW<span className="text-accent">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
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

        {/* Desktop Social & Contact */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href={PORTFOLIO_DATA.socialLinks.linkedin} target="_blank" className="group p-1" aria-label="LinkedIn">
            <div className="w-5 h-5 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/linkedin.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.github} target="_blank" className="group p-1" aria-label="GitHub">
            <div className="w-5 h-5 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/github.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.facebook} target="_blank" className="group p-1" aria-label="Facebook">
            <div className="w-5 h-5 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/facebook.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.instagram} target="_blank" className="group p-1" aria-label="Instagram">
            <div className="w-5 h-5 bg-foreground/80 group-hover:bg-accent transition-colors" style={{ WebkitMaskImage: "url('/icons/social/instagram.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground hover:text-accent transition-colors"
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
