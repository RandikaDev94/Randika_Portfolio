"use client";

import { useEffect, useState } from "react";

export function GlobalGlow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-50] pointer-events-none overflow-hidden bg-black">
      {/* A static glow mixing the 'accent' blue with pure black, matching the Hero image glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.20) 0%, rgba(0, 0, 0, 1) 70%)" }}
      />
    </div>
  );
}
