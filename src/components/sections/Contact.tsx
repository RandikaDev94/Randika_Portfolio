"use client";

import { PORTFOLIO_DATA } from "@/constants/data";
import { Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-foreground/5 relative border-t border-foreground/5 min-h-[80vh] flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-accent font-medium mb-4 tracking-widest uppercase text-sm">What's Next?</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            I'm currently looking for new opportunities as a Web Developer or IT Technician. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 bg-background p-8 rounded-2xl border border-foreground/10">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 text-[10px]">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Email</p>
                <a href={`mailto:${PORTFOLIO_DATA.contact.email}`} className="text-lg font-medium hover:text-accent transition-colors">
                  {PORTFOLIO_DATA.contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Location</p>
                <p className="text-lg font-medium">Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Form Outline */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="Project Inquiry"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                placeholder="Hello, I'd like to talk about..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
