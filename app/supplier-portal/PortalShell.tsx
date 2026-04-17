"use client";

import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { TendersPage } from "./TendersPage";
import { SubmissionsPage } from "./SubmissionsPage";
import { ClarificationsPage } from "./ClarificationsPage";
import { NotificationsPage } from "./NotificationsPage";
import { BidWorkspace } from "./BidWorkspace";
import { useStore } from "./store";

function Topbar() {
  const { page, activeTender, goTo, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  const breadcrumbs: React.ReactNode = (() => {
    if (page === "tenders") {
      return <strong className="text-slate-900 text-[12.5px] font-medium">My Tenders</strong>;
    }
    if (page === "bid") {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goTo("tenders")}
            className="text-slate-500 hover:text-slate-800 text-[12.5px] cursor-pointer transition-colors"
          >
            My Tenders
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <strong className="text-slate-900 text-[12.5px] font-medium truncate max-w-xs">
            {activeTender.title}
          </strong>
        </div>
      );
    }
    if (page === "submissions") {
      return <strong className="text-slate-900 text-[12.5px] font-medium">My Submissions</strong>;
    }
    if (page === "clarifications") {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goTo("tenders")}
            className="text-slate-500 hover:text-slate-800 text-[12.5px] cursor-pointer transition-colors"
          >
            My Tenders
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <strong className="text-slate-900 text-[12.5px] font-medium">Q&A / Clarifications</strong>
        </div>
      );
    }
    if (page === "notifications") {
      return <strong className="text-slate-900 text-[12.5px] font-medium">Notifications</strong>;
    }
    const label = page.charAt(0).toUpperCase() + page.slice(1);
    return <strong className="text-slate-900 text-[12.5px] font-medium">{label}</strong>;
  })();

  const showBack = page === "bid" || page === "clarifications";

  return (
    <header className="bg-white border-b border-black/8 h-[52px] flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-slate-500">{breadcrumbs}</div>
      <div className="flex items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={() => goTo("tenders")}>
            <ArrowLeft className="w-3 h-3" /> Back
          </Button>
        )}
      </div>
    </header>
  );
}

function PageContent() {
  const { page } = useStore();

  if (page === "tenders") return <TendersPage />;
  if (page === "bid") return <BidWorkspace />;
  if (page === "submissions") return <SubmissionsPage />;
  if (page === "clarifications") return <ClarificationsPage />;
  if (page === "notifications") return <NotificationsPage />;

  // Placeholder pages
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    profile: "Company Profile",
    settings: "Settings",
  };
  const label = labels[page] ?? page;
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-12 text-center text-slate-400">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
      <div className="text-[14px] font-medium text-slate-600 mb-1">{label}</div>
      <div className="text-[12px]">Available in the full build.</div>
      <Button variant="primary" className="mt-5" onClick={() => {}}>
        Back to tenders
      </Button>
    </div>
  );
}

export function PortalShell() {
  return (
    <div className="flex min-h-screen bg-[#F2F4F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <PageContent />
        </main>
      </div>
    </div>
  );
}
