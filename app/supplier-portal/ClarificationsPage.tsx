"use client";

import React, { useState } from "react";
import { MessageSquare, CheckCircle, Clock, Send, ChevronDown, Info, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "./store";

type FilterType = "ALL" | "MINE" | "ANSWERED" | "PENDING";

export function ClarificationsPage() {
  const {
    tenders,
    clarifications,
    activeClarifTenderId,
    clarifFilter,
    clarifComposeOpen,
    clarifComposeAnonymous,
    setClarifFilter,
    toggleCompose,
    setClarifAnon,
    submitQuestion,
    openTenderClarif,
  } = useStore();

  const [composeText, setComposeText] = useState("");

  const activeTenders = tenders.filter(
    (x) => x.my_status === "INVITED" || x.my_status === "ACCEPTED" || x.my_status === "SUBMITTED"
  );

  const t = tenders.find((x) => x.id === activeClarifTenderId);
  const allC = clarifications.filter((c) => c.tender_id === activeClarifTenderId);
  const answered = allC.filter((c) => c.status === "ANSWERED");
  const pending = allC.filter((c) => c.status === "PENDING");
  const mine = allC.filter((c) => c.isMine);
  const broadcast = allC.filter((c) => c.broadcast);

  let filtered = allC;
  if (clarifFilter === "MINE") filtered = mine;
  if (clarifFilter === "ANSWERED") filtered = answered;
  if (clarifFilter === "PENDING") filtered = pending;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: allC.length },
    { key: "MINE", label: "My questions", count: mine.length },
    { key: "ANSWERED", label: "Answered", count: answered.length },
    { key: "PENDING", label: "Pending", count: pending.length },
  ];

  const handleSubmit = () => {
    submitQuestion(composeText);
    setComposeText("");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight mb-0.5">
            Q&A / Clarifications
          </h1>
          {t && (
            <p className="text-[12px] text-slate-500">
              {t.number} — {t.title} · {allC.length} total questions
            </p>
          )}
        </div>
        <Button variant="primary" size="sm" onClick={toggleCompose}>
          <MessageSquare className="w-3 h-3" /> New question
        </Button>
      </div>

      {/* Tender selector */}
      {activeTenders.length > 1 && (
        <div className="mb-4">
          <label className="text-[11.5px] font-medium text-slate-600 mb-1 block">Tender</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12.5px] text-slate-900 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
            value={activeClarifTenderId}
            onChange={(e) => openTenderClarif(parseInt(e.target.value))}
          >
            {activeTenders.map((x) => {
              const cnt = clarifications.filter((c) => c.tender_id === x.id).length;
              return (
                <option key={x.id} value={x.id}>
                  {x.number} — {x.title} ({cnt} Q&As)
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label: "Awaiting answer", value: pending.length, color: "bg-amber-500" },
          { label: "Answered", value: answered.length, color: "bg-emerald-600" },
          { label: "Published to all", value: broadcast.length, color: "bg-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-black/8 rounded-[13px] px-4 py-3.5 relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 w-[3px] h-full rounded-l-[13px]", s.color)} />
            <div className="text-[24px] font-semibold text-slate-900 tracking-tight leading-none mb-1">{s.value}</div>
            <div className="text-[11px] text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clarif deadline */}
      {t?.clarDeadline && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700 mb-4">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>
            Clarification deadline for <strong>{t.number}</strong> is{" "}
            <strong>{t.clarDeadline}</strong>. Questions submitted after this date may not receive a response.
          </span>
        </div>
      )}

      {/* Corrigendum */}
      {t?.id === 1 && (
        <div className="flex items-start gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 mb-4">
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Corrigendum issued</strong> — Technical specification v2.1 updated on 1 Sep 2025.
            Review the updated document before raising pricing-related questions.
          </div>
        </div>
      )}

      {/* Broadcast info */}
      <div className="flex items-start gap-2 px-3.5 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700 mb-4">
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <div>
          Questions marked <strong>Published to all</strong> are visible to every invited supplier.
          Answers to your anonymous questions will be broadcast without revealing your identity.
        </div>
      </div>

      {/* Compose panel */}
      <Card className="mb-5 overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 cursor-pointer select-none"
          onClick={toggleCompose}
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            <MessageSquare className="w-3.5 h-3.5" />
            Raise a new question
          </div>
          <ChevronDown
            className={cn("w-4 h-4 text-slate-400 transition-transform", clarifComposeOpen && "rotate-180")}
          />
        </div>

        {clarifComposeOpen && (
          <CardContent className="p-4">
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700 mb-3">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              Your question will be reviewed by the buyer. The answer may be published to all bidders depending on relevance.
            </div>

            <div className="mb-3">
              <label className="text-[11.5px] font-medium text-slate-600 mb-1 block">
                Your question <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12.5px] text-slate-900 resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 min-h-[90px] leading-relaxed"
                placeholder="Type a clear, specific question about the tender requirements…"
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Be specific. Reference section numbers, line item codes, or specification clauses where applicable.
              </p>
            </div>

            <div className="flex items-center gap-3 py-2.5 border-t border-slate-100">
              <div className="flex-1">
                <div className="text-[12px] font-medium text-slate-800">Submit anonymously</div>
                <div className="text-[11px] text-slate-500">
                  Your company name will be hidden from other bidders when the answer is published.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={clarifComposeAnonymous}
                  onChange={(e) => setClarifAnon(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>

            <div className="flex gap-2 mt-3">
              <Button variant="primary" size="sm" onClick={handleSubmit}>
                <Send className="w-3 h-3" /> Submit question
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleCompose}>Cancel</Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-0 bg-slate-100 rounded-lg p-0.5 w-fit mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setClarifFilter(f.key)}
            className={cn(
              "px-3.5 py-1.5 text-[12px] font-medium rounded-md transition-all cursor-pointer",
              clarifFilter === f.key
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Q&A cards */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <MessageSquare className="w-9 h-9 mx-auto mb-3 opacity-30" />
            <div className="text-[13px] font-medium text-slate-600 mb-1">No questions found</div>
            <div className="text-[11.5px]">
              {clarifFilter === "ALL"
                ? "No questions have been raised for this tender yet."
                : "Try changing the filter to see more questions."}
            </div>
          </div>
        ) : (
          filtered.map((c) => (
            <Card
              key={c.id}
              className={cn(
                "overflow-hidden transition-all hover:border-slate-200 hover:shadow-xs",
                c.isMine && "border-l-[3px] border-l-emerald-500",
                !c.isMine && c.status === "PENDING" && "border-l-[3px] border-l-amber-500"
              )}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    Q{c.id}
                  </span>
                  {c.status === "ANSWERED" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <CheckCircle className="w-2.5 h-2.5" /> Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-2.5 h-2.5" /> Awaiting answer
                    </span>
                  )}
                  {c.broadcast && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Users className="w-2.5 h-2.5" /> Published to all
                    </span>
                  )}
                  {c.isMine && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                      My question
                    </span>
                  )}
                  {c.anonymous && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Anonymous
                    </span>
                  )}
                </div>
                <span className="text-[10.5px] text-slate-400">Asked {c.asked}</span>
              </div>

              {/* Card body */}
              <CardContent className="p-4">
                <p className="text-[13px] font-medium text-slate-900 leading-relaxed mb-3">
                  {c.question}
                </p>

                {c.status === "ANSWERED" && c.answer ? (
                  <div className="bg-slate-50 border-l-[3px] border-l-emerald-400 rounded-r-lg pl-3.5 pr-4 py-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
                      <CheckCircle className="w-2.5 h-2.5" /> Official answer
                    </div>
                    <p className="text-[12.5px] text-slate-700 leading-relaxed">{c.answer}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10.5px] text-slate-400 flex-wrap">
                      {c.answeredBy && <span>{c.answeredBy}</span>}
                      <span>· {c.answered}</span>
                      {c.broadcast && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                          <Users className="w-2 h-2" /> Broadcast to all
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-dashed border-amber-300 rounded-lg text-[12px] text-amber-700">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <div>
                      <strong>Awaiting buyer response.</strong> You will be notified when this question is answered.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
