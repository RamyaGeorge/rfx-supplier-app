"use client";

import React from "react";
import { CheckCircle, Building2, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "./store";
import { Tender, TenderType, fmtAmount } from "./data";

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

function AwardedCard({ t }: { t: Tender }) {
  const { openTender } = useStore();
  return (
    <Card
      className="border-emerald-300 bg-gradient-to-br from-emerald-50/60 to-white cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all"
      onClick={() => openTender(t.id)}
    >
      <CardContent className="p-5 grid grid-cols-[1fr_auto] gap-3.5 items-center">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TypeTag type={t.type} />
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-2.5 h-2.5" /> Awarded
            </span>
          </div>
          <div className="text-[14px] font-semibold text-slate-900 tracking-tight mb-0.5">{t.title}</div>
          <div className="font-mono text-[11px] text-slate-400 mb-2">{t.number}</div>
          <div className="flex flex-wrap gap-3 text-[11.5px] text-slate-500">
            <span className="flex items-center gap-1"><Building2 className="w-2.5 h-2.5" />{t.buyer}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5 text-emerald-600" />Award date: {t.award_date}</span>
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{t.contract_months} month contract</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div>
            <div className="text-[15px] font-semibold text-emerald-700 tracking-tight">
              {t.award_amount ? fmtAmount(t.award_amount) : "—"}
            </div>
            <div className="text-[10.5px] text-slate-400 text-right">Award value</div>
          </div>
          <Button size="sm" onClick={(e) => { e.stopPropagation(); openTender(t.id); }}>
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmittedCard({ t, dimmed }: { t: Tender; dimmed?: boolean }) {
  const { openTender } = useStore();
  return (
    <Card
      className={cn(
        "cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all",
        dimmed && "opacity-70"
      )}
      onClick={() => openTender(t.id)}
    >
      <CardContent className="p-5 grid grid-cols-[1fr_auto] gap-3.5 items-center">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TypeTag type={t.type} />
            {dimmed ? (
              <Badge variant="closed">Closed</Badge>
            ) : (
              <>
                <Badge variant="submitted">Submitted</Badge>
                {t.two_envelope && <Badge variant="published">Two-envelope</Badge>}
              </>
            )}
          </div>
          <div className="text-[14px] font-semibold text-slate-900 tracking-tight mb-0.5">{t.title}</div>
          <div className="font-mono text-[11px] text-slate-400 mb-2">{t.number}</div>
          <div className="flex flex-wrap gap-3 text-[11.5px] text-slate-500">
            <span className="flex items-center gap-1"><Building2 className="w-2.5 h-2.5" />{t.buyer}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {dimmed ? "Closed: " : "Deadline: "}{t.deadline}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {t.bid_amount ? (
            <div>
              <div className={cn("text-[15px] font-semibold tracking-tight", dimmed ? "text-slate-600" : "text-emerald-700")}>
                {fmtAmount(t.bid_amount)}
              </div>
              <div className="text-[10.5px] text-slate-400 text-right">Bid value</div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">Sealed bid</div>
          )}
          <Button size="sm" variant={dimmed ? "ghost" : "default"} onClick={(e) => { e.stopPropagation(); openTender(t.id); }}>
            {dimmed ? "View" : "View bid"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SubmissionsPage() {
  const { tenders } = useStore();
  const submitted = tenders.filter((t) => t.my_status === "SUBMITTED");
  const awarded = submitted.filter((t) => t.awarded_to_us);
  const pending = submitted.filter((t) => !t.awarded_to_us && t.status !== "CLOSED");
  const closed = submitted.filter((t) => !t.awarded_to_us && t.status === "CLOSED");
  const totalBidValue = submitted.reduce((s, t) => s + (t.bid_amount || 0), 0);
  const awardedValue = awarded.reduce((s, t) => s + (t.award_amount || 0), 0);

  const stats = [
    { label: "Contracts awarded", value: awarded.length, color: "bg-amber-700" },
    { label: "Total submissions", value: submitted.length, color: "bg-emerald-600" },
    { label: "Total bid value", value: totalBidValue ? fmtAmount(totalBidValue).replace("₹", "") : "—", color: "bg-blue-600" },
    { label: "Value awarded", value: awardedValue ? fmtAmount(awardedValue).replace("₹", "") : "—", color: "bg-emerald-900" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight mb-0.5">My Submissions</h1>
          <p className="text-[12px] text-slate-500">All submitted bids and contract awards</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-black/8 rounded-[13px] px-4 py-3.5 relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 w-[3px] h-full rounded-l-[13px]", s.color)} />
            <div className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none mb-1">{s.value}</div>
            <div className="text-[11px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {awarded.length > 0 && (
        <>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest py-3">Awarded contracts</div>
          <div className="flex flex-col gap-2.5">
            {awarded.map((t) => <AwardedCard key={t.id} t={t} />)}
          </div>
        </>
      )}

      {pending.length > 0 && (
        <>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest py-3">Under evaluation</div>
          <div className="flex flex-col gap-2.5">
            {pending.map((t) => <SubmittedCard key={t.id} t={t} />)}
          </div>
        </>
      )}

      {closed.length > 0 && (
        <>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest py-3">Closed</div>
          <div className="flex flex-col gap-2.5">
            {closed.map((t) => <SubmittedCard key={t.id} t={t} dimmed />)}
          </div>
        </>
      )}
    </div>
  );
}
