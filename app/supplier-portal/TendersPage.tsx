"use client";

import React from "react";
import {
  Clock,
  Building2,
  Package,
  FileText,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "./store";
import { Tender, TenderType } from "./data";

// Use inline icons to avoid naming conflicts
const EnvelopeIcon = () => (
  <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="12" height="9" rx="1" />
    <path d="M2 7l6 4 6-4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2l1.5 4h4.5l-3.5 2.5 1.5 4L8 10l-4 2.5 1.5-4L2 6h4.5z" />
  </svg>
);

const typeTagClasses: Record<TenderType, string> = {
  RFI: "bg-indigo-50 text-indigo-700",
  RFP: "bg-emerald-50 text-emerald-700",
  RFQ: "bg-amber-50 text-amber-700",
  RFT: "bg-red-50 text-red-700",
};

function TypeTag({ type }: { type: TenderType }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-[5px] tracking-wide",
        typeTagClasses[type]
      )}
    >
      {type}
    </span>
  );
}

function StatusBadge({ tender }: { tender: Tender }) {
  if (tender.awarded_to_us) {
    return (
      <Badge variant="awarded">
        <CheckCircle className="w-2.5 h-2.5" /> Awarded
      </Badge>
    );
  }
  const variantMap: Record<string, "invited" | "accepted" | "submitted" | "withdrawn" | "disqualified"> = {
    INVITED: "invited",
    ACCEPTED: "accepted",
    SUBMITTED: "submitted",
    WITHDRAWN: "withdrawn",
    DISQUALIFIED: "disqualified",
  };
  return <Badge variant={variantMap[tender.my_status] ?? "draft"}>{tender.my_status}</Badge>;
}

function TenderCard({ tender }: { tender: Tender }) {
  const { openTender, openTenderClarif, acceptInvite, clarifications } = useStore();

  const tClarifs = clarifications.filter((c) => c.tender_id === tender.id);
  const pendingQ = tClarifs.filter((c) => c.status === "PENDING" && c.isMine).length;

  const isAwarded = !!tender.awarded_to_us;
  const isUrgent = tender.urgent;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-sm relative overflow-hidden",
        isUrgent && "border-l-[3px] border-l-red-400",
        isAwarded && "border-emerald-300 bg-gradient-to-br from-emerald-50/60 to-white"
      )}
      onClick={() => openTender(tender.id)}
    >
      {isUrgent && (
        <div className="absolute top-0 right-5 bg-red-500 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-b-md tracking-wider uppercase">
          Urgent
        </div>
      )}

      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[14px] font-semibold text-slate-900 tracking-tight mb-0.5">
              {tender.title}
            </div>
            <div className="font-mono text-[11px] text-slate-400">{tender.number}</div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
            {tender.daysLeft > 0 && (
              <span
                className={cn(
                  "text-[10.5px] font-medium px-1.5 py-0.5 rounded-md",
                  tender.daysLeft < 15
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {tender.daysLeft}d left
              </span>
            )}
            <StatusBadge tender={tender} />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3.5 text-[11.5px] text-slate-500 mb-3.5">
          <TypeTag type={tender.type} />
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Deadline: {tender.deadline}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-2.5 h-2.5" /> {tender.buyer}
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-2.5 h-2.5" /> Est: {tender.estimated}
          </span>
          {tender.bid_bond_req && (
            <span className="flex items-center gap-1 text-amber-600">
              <StarIcon /> Bid bond req.
            </span>
          )}
          {tender.two_envelope && (
            <span className="flex items-center gap-1 text-blue-600">
              <EnvelopeIcon /> Two-envelope
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {tender.my_status === "INVITED" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => { e.stopPropagation(); acceptInvite(tender.id); }}
              >
                <CheckCircle className="w-3 h-3" /> Accept invite
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                Decline
              </Button>
            </>
          )}
          {tender.my_status === "ACCEPTED" && (
            <>
              <Button variant="primary" size="sm" onClick={() => openTender(tender.id)}>
                Continue bid
              </Button>
              {tender.progress > 0 && (
                <span className="text-[11px] text-slate-400 ml-1">{tender.progress}% complete</span>
              )}
            </>
          )}
          {tender.my_status === "SUBMITTED" && !isAwarded && (
            <Button size="sm" onClick={() => openTender(tender.id)}>
              <FileText className="w-3 h-3" /> View bid
            </Button>
          )}
          {isAwarded && (
            <Button variant="primary" size="sm" onClick={() => openTender(tender.id)}>
              <CheckCircle className="w-3 h-3" /> View award
            </Button>
          )}

          {tClarifs.length > 0 && (
            <Button
              size="sm"
              variant={pendingQ > 0 ? "amber" : "default"}
              onClick={(e) => { e.stopPropagation(); openTenderClarif(tender.id); }}
            >
              <MessageSquare className="w-3 h-3" />
              Q&A
              {pendingQ > 0 && (
                <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingQ}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Progress bar */}
        {tender.my_status === "ACCEPTED" && tender.progress > 0 && (
          <div className="mt-3.5 h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${tender.progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TendersPage() {
  const { tenders } = useStore();

  const pending = tenders.filter(
    (t) => t.my_status === "INVITED" || t.my_status === "ACCEPTED"
  ).length;
  const submitted = tenders.filter((t) => t.my_status === "SUBMITTED").length;
  const awarded = tenders.filter((t) => t.awarded_to_us).length;

  const stats = [
    { label: "Pending action", value: pending, color: "bg-amber-500" },
    { label: "Submitted bids", value: submitted, color: "bg-emerald-600" },
    { label: "Awarded", value: awarded, color: "bg-amber-700" },
    { label: "Total events", value: tenders.length, color: "bg-slate-300" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight mb-0.5">
            My Tenders
          </h1>
          <p className="text-[12px] text-slate-500">
            Active invitations and live procurement events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-black/8 rounded-[13px] px-4 py-3.5 relative overflow-hidden"
          >
            <div
              className={cn("absolute top-0 left-0 w-[3px] h-full rounded-l-[13px]", s.color)}
            />
            <div className="text-[24px] font-semibold text-slate-900 tracking-tight leading-none mb-1">
              {s.value}
            </div>
            <div className="text-[11px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5">
        {tenders.map((t) => (
          <TenderCard key={t.id} tender={t} />
        ))}
      </div>
    </div>
  );
}
