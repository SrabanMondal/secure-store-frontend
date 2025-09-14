"use client";

import Sidebar from "@/components/sidebar";
import TopNav from "@/components/topnav";
import { useProtectedRoute } from "@/hooks/use-protected-route";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute();

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <TopNav />
        <main className="flex-1 bg-gray-50 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
