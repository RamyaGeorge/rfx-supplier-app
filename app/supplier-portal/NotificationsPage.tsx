"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "./store";

export function NotificationsPage() {
  const { notifications, markAllRead, openTender, openTenderClarif } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight mb-0.5">Notifications</h1>
          <p className="text-[12px] text-slate-500">{unread} unread</p>
        </div>
        <Button size="sm" onClick={markAllRead}>Mark all read</Button>
      </div>

      <Card>
        <CardContent className="p-5 divide-y divide-slate-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-5 px-5 rounded-lg transition-colors"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0 ${
                  n.read ? "bg-slate-300" : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-[12.5px] text-slate-800 leading-relaxed">{n.text}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-mono text-[9.5px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {n.key}
                  </span>
                  <span className="text-[10.5px] text-slate-400">{n.time}</span>
                </div>
              </div>
              {n.tender_id && (
                <Button
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => {
                    if (n.key === "CLARIF_PUBLISHED") {
                      openTenderClarif(n.tender_id!);
                    } else {
                      openTender(n.tender_id!);
                    }
                  }}
                >
                  View
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
