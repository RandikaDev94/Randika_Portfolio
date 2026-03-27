import { PORTFOLIO_DATA } from "@/constants/data";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-foreground/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-foreground/60 text-sm mb-4 md:mb-0">
          &copy; {year} {PORTFOLIO_DATA.name}. All rights reserved.
        </p>
        <p className="text-foreground/60 text-sm">
          Designed & Built by <span className="text-accent font-medium">{PORTFOLIO_DATA.name}</span>
        </p>
      </div>
    </footer>
  );
}
