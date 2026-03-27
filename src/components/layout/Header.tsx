"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/Icons";
import { PORTFOLIO_DATA } from "@/constants/data";
import Link from "next/link";
import { useLenis } from "lenis/react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-foreground/10" : "bg-transparent"
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
          <Link href={PORTFOLIO_DATA.socialLinks.linkedin} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
            <LinkedinIcon size={20} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.github} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
            <GithubIcon size={20} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.facebook} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
            <FacebookIcon size={20} />
          </Link>
          <Link href={PORTFOLIO_DATA.socialLinks.instagram} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
            <InstagramIcon size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground hover:text-accent transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
                <Link href={PORTFOLIO_DATA.socialLinks.linkedin} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
                  <LinkedinIcon size={24} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.github} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
                  <GithubIcon size={24} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.facebook} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
                  <FacebookIcon size={24} />
                </Link>
                <Link href={PORTFOLIO_DATA.socialLinks.instagram} target="_blank" className="text-foreground/80 hover:text-accent transition-colors">
                  <InstagramIcon size={24} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
