"use client";

import React from "react";
import {
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore, Page } from "./store";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: "red" | "amber" | "green";
}

export function Sidebar() {
  const { page, goTo, tenders, clarifications, notifications } = useStore();

  const pendingTenders = tenders.filter(
    (t) => t.my_status === "INVITED" || t.my_status === "ACCEPTED"
  ).length;
  const submittedTenders = tenders.filter((t) => t.my_status === "SUBMITTED").length;
  const pendingClarif = clarifications.filter((c) => c.status === "PENDING" && c.isMine).length;
  const unread = notifications.filter((n) => !n.read).length;

  const workspaceItems: NavItem[] = [
    {
      id: "tenders",
      label: "My Tenders",
      icon: <Calendar className="w-3.5 h-3.5" />,
      badge: pendingTenders || undefined,
      badgeColor: "amber",
    },
    {
      id: "submissions",
      label: "My Submissions",
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: submittedTenders || undefined,
      badgeColor: "green",
    },
    {
      id: "clarifications",
      label: "Q&A / Clarifications",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      badge: pendingClarif || undefined,
      badgeColor: "amber",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-3.5 h-3.5" />,
      badge: unread || undefined,
      badgeColor: "red",
    },
  ];

  const activePage = page === "bid" ? "tenders" : page;

  const badgeClasses: Record<string, string> = {
    red: "bg-red-600 text-white",
    amber: "bg-amber-600 text-white",
    green: "bg-emerald-700 text-white",
  };

  return (
    <aside className="w-56 bg-[#0c1014] flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/6 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-emerald-700 rounded-[9px] flex items-center justify-center flex-shrink-0">
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white tracking-tight">ProcureFlow</div>
          <div className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">Supplier Portal</div>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        {/* Workspace section */}
        <div className="px-4 pt-4 pb-1 text-[9.5px] font-semibold text-white/25 uppercase tracking-widest">
          Workspace
        </div>
        <nav className="px-2 pb-2">
          {workspaceItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-[9px] text-[13px] transition-all cursor-pointer text-left my-0.5",
                activePage === item.id
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "text-white/48 hover:bg-white/6 hover:text-white/82"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                    badgeClasses[item.badgeColor || "green"]
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

      </ScrollArea>

      {/* User footer */}
      <div className="px-4 py-3.5 border-t border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-900/50 flex items-center justify-center text-[11px] font-semibold text-emerald-400 flex-shrink-0">
            RK
          </div>
          <div>
            <div className="text-[12px] font-medium text-white/80 leading-tight">Rajesh Kumar</div>
            <div className="text-[11px] text-white/35">ABC Lighting Co.</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
