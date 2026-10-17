import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Randika Wijesooriya",
  description: "Private management dashboard for certificates, experiences, and projects.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#070709] text-foreground">
        {children}
      </div>
    </AuthProvider>
  );
}
