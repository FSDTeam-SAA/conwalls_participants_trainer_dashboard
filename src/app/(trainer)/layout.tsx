

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import DashboardHeader from "../(participants)/_components/dashboard-header";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full">

        {/* ✅ Full Width Header */}
        <div className=" w-full sticky top-0 z-50">
          <DashboardHeader />
        </div>

        {/* ✅ Sidebar + Content */}
        <div className="flex w-full">

          {/* Sidebar */}
          <div
            style={{ "--sidebar-width": "335px" } as React.CSSProperties}
          >
            <DashboardSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 bg-[#F8F9FA] min-h-screen p-6">
            <div className="lg:hidden p-4">
              <SidebarTrigger />
            </div>
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}