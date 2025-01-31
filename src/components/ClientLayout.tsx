"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProvider from "@/components/SessionProvider";

export default function ClientLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sidebar = useSidebar();

  useEffect(() => {
    setIsHydrated(true);
    setIsOpen(sidebar.getOpenState());
  }, [sidebar]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-[90px]"
        }`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>{children}</SessionProvider>
        </ThemeProvider>
      </main>
    </div>
  );
}
