import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { GlobalGlow } from "@/components/ui/GlobalGlow";
import Preloader from "@/components/ui/Preloader";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Randika Wijesooriya | Portfolio",
  description: "IT Technician & Web Developer based in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased dark`} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white" suppressHydrationWarning>
        <Preloader />
        <GlobalGlow />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
