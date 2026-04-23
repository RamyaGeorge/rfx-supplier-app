"use client";

import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  MessageSquare,
  Download,
  Lock,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useStore } from "./store";
import { qSections, tenderDocuments, fmtAmount, TenderType } from "./data";

const typeTagClasses: Record<TenderType, string> = {
  RFI: "bg-indigo-50 text-indigo-700",
  RFP: "bg-emerald-50 text-emerald-700",
  RFQ: "bg-amber-50 text-amber-700",
};

function TypeTag({ type }: { type: TenderType }) {
  return (
    <span className={cn("font-mono text-[10px] font-medium px-1.5 py-0.5 rounded tracking-wide", typeTagClasses[type])}>
      {type}
    </span>
  );
}

const ALL_STEPS = ["Documents", "Questionnaire", "Line items", "Review & submit"];
const RFI_STEPS = ["Documents", "Questionnaire", "Review & submit"];

/* ─── Award screen ─────────────────────────────────────────── */
function AwardScreen() {
  const { activeTender, goTo } = useStore();
  const t = activeTender;
  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 rounded-2xl p-7 text-center mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-700" strokeWidth={2.5} />
        </div>
        <h2 className="text-[18px] font-semibold text-emerald-700 tracking-tight mb-1">Contract Awarded</h2>
        <p className="text-[12.5px] text-slate-600 mb-1">
          Congratulations — ABC Lighting Co. has been selected for this contract.
        </p>
        <p className="font-mono text-[11.5px] text-slate-400 mb-5">
          {t.title} · {t.number}
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="primary">
            <Download className="w-3 h-3" /> Download award letter
          </Button>
          <Button>View contract</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <CardTitle className="mb-4">Award details</CardTitle>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            {[
              ["Awarded amount", t.award_amount ? fmtAmount(t.award_amount) : "—"],
              ["Buyer", "NovaTech Infra"],
              ["Contract duration", `${t.contract_months} months`],
              ["Award date", t.award_date ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex px-3.5 py-2.5 border-b border-slate-100 last:border-0 text-[12.5px]">
                <div className="text-slate-500 w-40 flex-shrink-0">{k}</div>
                <div className="text-slate-900 font-medium">{v}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Step 0: Documents ─────────────────────────────────────── */
function DocsStep() {
  const { ackedDocs, ackDoc } = useStore();
  const allAcked = tenderDocuments.filter((d) => d.ack_req).every((d) => ackedDocs[d.name]);

  const docColors: Record<string, string> = {
    RFX_DOCUMENT: "bg-blue-50 text-blue-700",
    NDA: "bg-red-50 text-red-700",
    TERMS_CONDITIONS: "bg-violet-50 text-violet-700",
    BOQ: "bg-amber-50 text-amber-700",
  };

  return (
    <Card>
      <CardContent className="p-5">
        {allAcked ? (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-700 mb-4">
            <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            All required documents acknowledged — you can proceed to the questionnaire.
          </div>
        ) : (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 mb-4">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Please acknowledge the NDA and Terms & Conditions before submitting your bid.
          </div>
        )}

        <CardTitle className="mb-3">Tender documents</CardTitle>

        <div className="divide-y divide-slate-100">
          {tenderDocuments.map((doc) => {
            const acked = ackedDocs[doc.name];
            return (
              <div key={doc.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    docColors[doc.type] ?? "bg-slate-100 text-slate-500"
                  )}
                >
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium text-slate-900">{doc.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {doc.type.replace(/_/g, " ")} · {doc.size}
                  </div>
                </div>
                <Button size="sm" className="mr-2">
                  <Download className="w-3 h-3" /> Download
                </Button>
                {doc.ack_req ? (
                  <button
                    onClick={() => ackDoc(doc.name)}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer",
                      acked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {acked ? (
                      <><CheckCircle className="w-2.5 h-2.5" /> Acknowledged</>
                    ) : (
                      "Acknowledge"
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-300">No ack. needed</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Step 1: Questionnaire ────────────────────────────────── */
function QuestionnaireStep() {
  const { selectedOptions, uploadedFiles, toggleUpload, selectOpt } = useStore();
  const answeredCount =
    Object.keys(uploadedFiles).length + Object.keys(selectedOptions).length + 1;
  const totalQ = qSections.reduce((s, sec) => s + sec.questions.length, 0);
  const pct = Math.round((answeredCount / totalQ) * 100);

  const sectionTypeClasses: Record<string, string> = {
    TECHNICAL: "bg-emerald-50 text-emerald-700",
    GENERAL: "bg-indigo-50 text-indigo-700",
    HSE: "bg-amber-50 text-amber-700",
    COMPLIANCE: "bg-red-50 text-red-700",
  };

  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <>
      {/* Completion bar */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 mb-4">
        <svg className="w-9 h-9 flex-shrink-0 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="16" fill="none"
            stroke="#1DB886" strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex-1">
          <div className="text-[12.5px] font-medium text-slate-800">
            Questionnaire {pct}% complete
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {Object.keys(selectedOptions).length} answered · {Object.keys(uploadedFiles).length} uploaded
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700 mb-4">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Questions marked <strong className="mx-1">Scored</strong> contribute to your technical evaluation score. Answer these with care.
          </div>

          <div className="flex flex-col gap-3">
            {qSections.map((sec) => {
              const answered = sec.questions.filter(
                (q) => selectedOptions[q.id] || uploadedFiles[q.id]
              ).length;
              return (
                <div key={sec.id} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-semibold text-slate-800">{sec.title}</span>
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded tracking-wide", sectionTypeClasses[sec.type] ?? "bg-slate-100 text-slate-500")}>
                        {sec.type}
                      </span>
                      {sec.mandatory && (
                        <span className="text-[10px] text-red-600 font-medium">Required</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{answered}/{sec.questions.length} answered</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {sec.questions.map((q) => (
                      <div key={q.id} className="px-4 py-3.5">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[12.5px] font-medium text-slate-900">{q.text}</span>
                          {q.mandatory && <span className="text-red-500 text-[13px]">*</span>}
                          {q.scored && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                              Scored {q.weight}%
                            </span>
                          )}
                        </div>
                        {q.hint && (
                          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{q.hint}</p>
                        )}

                        {q.type === "FILE_UPLOAD" && (
                          <div
                            onClick={() => toggleUpload(q.id)}
                            className={cn(
                              "border-[1.5px] rounded-lg p-4 text-center cursor-pointer transition-all",
                              uploadedFiles[q.id]
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50"
                            )}
                          >
                            {uploadedFiles[q.id] ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                <p className="text-[12px] text-emerald-700 font-medium">File uploaded</p>
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-medium mt-1.5">
                                  <Download className="w-2.5 h-2.5" /> Material_Cert.pdf
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                <p className="text-[12px] text-slate-400">Click to upload or drag & drop</p>
                                <p className="text-[11px] text-slate-300 mt-0.5">PDF, DOCX — max 20 MB</p>
                              </>
                            )}
                          </div>
                        )}

                        {q.type === "SINGLE_CHOICE" && (
                          <div className="flex flex-col gap-1.5">
                            {(q.options ?? []).map((opt) => {
                              const sel = selectedOptions[q.id] === opt;
                              return (
                                <div
                                  key={opt}
                                  onClick={() => selectOpt(q.id, opt)}
                                  className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[12.5px] cursor-pointer transition-all",
                                    sel
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all",
                                    sel ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                                  )}>
                                    {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === "BOOLEAN" && (
                          <div className="flex gap-2">
                            {["yes", "no"].map((opt) => {
                              const sel = selectedOptions[q.id] === opt;
                              return (
                                <div
                                  key={opt}
                                  onClick={() => selectOpt(q.id, opt)}
                                  className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg border text-[12.5px] cursor-pointer transition-all capitalize",
                                    sel
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0",
                                    sel ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                                  )}>
                                    {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === "NUMERIC" && (
                          <input
                            type="number"
                            className="w-44 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            placeholder="Enter number"
                            defaultValue={selectedOptions[q.id] ?? ""}
                            onChange={(e) => selectOpt(q.id, e.target.value)}
                          />
                        )}

                        {q.type === "TEXT" && (
                          <textarea
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] text-slate-900 resize-y min-h-[60px] leading-relaxed focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            placeholder="Type your answer…"
                            defaultValue={selectedOptions[q.id] ?? ""}
                            onChange={(e) => selectOpt(q.id, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* ─── Step 2: Line items ───────────────────────────────────── */
function LineItemsStep() {
  const { bidItems, updateBidItem } = useStore();
  const total = bidItems.reduce((s, it) => s + parseFloat(it.unit_price || "0") * it.quantity, 0);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Line item pricing (BOQ)</CardTitle>
        </div>

        <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700 mb-4">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          All items must be priced. Your prices are sealed until the financial envelope opening date (15 Oct 2025).
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl mb-5">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Item", "Qty", "Unit price (₹)", "Total (₹)", "Lead time", "Brand", "Model no.", "Origin"].map((h) => (
                  <th key={h} className="text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide px-2.5 py-2 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bidItems.map((it, i) => {
                const rowTotal = parseFloat(it.unit_price || "0") * it.quantity;
                return (
                  <tr key={it.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-2.5 py-2 text-center text-slate-400 text-[11px]">{i + 1}</td>
                    <td className="px-2.5 py-2">
                      <div className="text-[12px] font-semibold text-slate-900">{it.item_code}</div>
                      <div className="text-[11px] text-slate-500">{it.description}</div>
                    </td>
                    <td className="px-2.5 py-2 text-right font-mono text-[12px]">
                      {it.quantity.toLocaleString("en-IN")} {it.unit}
                    </td>
                    <td className="px-2.5 py-2">
                      <input
                        type="number"
                        defaultValue={it.unit_price}
                        className="w-24 px-2 py-1 border border-slate-200 rounded text-[12px] text-right focus:outline-none focus:border-emerald-500"
                        onChange={(e) => updateBidItem(i, "unit_price", e.target.value)}
                      />
                    </td>
                    <td className="px-2.5 py-2 text-right font-mono text-[11.5px] text-slate-700">
                      {fmtAmount(rowTotal)}
                    </td>
                    <td className="px-2.5 py-2">
                      <input
                        type="number"
                        defaultValue={it.lead_time_days}
                        className="w-16 px-2 py-1 border border-slate-200 rounded text-[12px] text-center focus:outline-none focus:border-emerald-500"
                        onChange={(e) => updateBidItem(i, "lead_time_days", e.target.value)}
                      />
                    </td>
                    <td className="px-2.5 py-2">
                      <input
                        defaultValue={it.brand}
                        className="w-20 px-2 py-1 border border-slate-200 rounded text-[12px] focus:outline-none focus:border-emerald-500"
                        onChange={(e) => updateBidItem(i, "brand", e.target.value)}
                      />
                    </td>
                    <td className="px-2.5 py-2">
                      <input
                        defaultValue={it.model_no}
                        className="w-24 px-2 py-1 border border-slate-200 rounded text-[12px] focus:outline-none focus:border-emerald-500"
                        onChange={(e) => updateBidItem(i, "model_no", e.target.value)}
                      />
                    </td>
                    <td className="px-2.5 py-2">
                      <select
                        defaultValue={it.country_of_origin}
                        className="w-16 px-1.5 py-1 border border-slate-200 rounded text-[12px] focus:outline-none focus:border-emerald-500"
                        onChange={(e) => updateBidItem(i, "country_of_origin", e.target.value)}
                      >
                        {["IN", "CN", "DE", "US"].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            <span className="text-[12px] text-slate-600">Grand total ({bidItems.length} items)</span>
            <span className="text-[15px] font-semibold text-slate-900 font-mono tracking-tight">
              {fmtAmount(total)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="grid grid-cols-3 gap-3.5 mb-3.5">
            <div>
              <label className="text-[11.5px] font-medium text-slate-600 block mb-1">Currency</label>
              <select className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] focus:outline-none focus:border-emerald-500">
                <option>INR — Indian Rupee</option>
              </select>
            </div>
            <div>
              <label className="text-[11.5px] font-medium text-slate-600 block mb-1">
                Bid validity (days) <span className="text-red-500">*</span>
              </label>
              <input type="number" defaultValue="90" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-[11.5px] font-medium text-slate-600 block mb-1">Delivery lead time (days)</label>
              <input type="number" defaultValue="45" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="mb-3.5">
            <label className="text-[11.5px] font-medium text-slate-600 block mb-1">
              Bid bond reference <span className="text-red-500">*</span>
            </label>
            <input defaultValue="HDFC/BG/2025/09/12345" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-slate-600 block mb-1">Cover note / remarks</label>
            <textarea
              rows={3}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12.5px] resize-y leading-relaxed focus:outline-none focus:border-emerald-500"
              defaultValue="We are pleased to submit our revised commercial offer. All prices are DDP inclusive."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Step 3: Review & submit ──────────────────────────────── */
function ReviewStep() {
  const { activeTender, ackedDocs, bidItems, selectedOptions, uploadedFiles, goTo } = useStore();
  const t = activeTender;

  const isRFI = t.type === "RFI";
  const allAcked = tenderDocuments.filter((d) => d.ack_req).every((d) => ackedDocs[d.name]);
  const allPriced = isRFI || bidItems.every((it) => parseFloat(it.unit_price || "0") > 0);
  const answeredQ = Object.keys(uploadedFiles).length + Object.keys(selectedOptions).length + 1;
  const totalQ = qSections.reduce((s, sec) => s + sec.questions.length, 0);
  const compPct = Math.round((answeredQ / totalQ) * 100);
  const totalBid = bidItems.reduce((s, it) => s + parseFloat(it.unit_price || "0") * it.quantity, 0);

  const checks = [
    { ok: allAcked, msg: allAcked ? "All required documents acknowledged" : "NDA and Terms & Conditions must be acknowledged" },
    { ok: compPct >= 80, msg: compPct >= 80 ? `Questionnaire ${compPct}% complete` : `Questionnaire incomplete — mandatory questions unanswered (${compPct}%)` },
    ...(!isRFI ? [{ ok: allPriced, msg: allPriced ? `All ${bidItems.length} line items priced` : "One or more line items not priced" }] : []),
    { ok: true, msg: "Bid validity set (90 days)" },
  ];
  const allOk = checks.every((c) => c.ok);

  return (
    <Card>
      <CardContent className="p-5">
        {allOk ? (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-700 mb-4">
            <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <div><strong>Ready to submit.</strong> All checks passed. Once submitted, your bid is sealed and cannot be edited.</div>
          </div>
        ) : (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 mb-4">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <div><strong>Bid not ready.</strong> Please complete the items below before submitting.</div>
          </div>
        )}

        <CardTitle className="mb-3">Response summary</CardTitle>
        <div className="border border-slate-100 rounded-lg overflow-hidden mb-5">
          {[
            ["Tender", t.title],
            ["Event number", t.number],
            ...(!isRFI ? [
              ["Total bid amount", fmtAmount(totalBid)],
              ["Line items", `${bidItems.length} items`],
              ["Financial envelope", "Sealed until 15 Oct 2025"],
            ] : []),
            ["Bid validity", "90 days"],
            ["Questionnaire", `${compPct}% complete`],
          ].map(([k, v]) => (
            <div key={k} className="flex px-3.5 py-2.5 border-b border-slate-100 last:border-0 text-[12.5px]">
              <div className="text-slate-500 w-44 flex-shrink-0">{k}</div>
              <div className={cn("font-medium", k === "Total bid amount" ? "text-emerald-700 text-[16px]" : "text-slate-900")}>
                {v}
              </div>
            </div>
          ))}
        </div>

        <CardTitle className="mb-3">Pre-submission checklist</CardTitle>
        <div className="divide-y divide-slate-100">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2.5 text-[12.5px]">
              {c.ok ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" strokeWidth={2.2} />
              ) : (
                <X className="w-3.5 h-3.5 text-red-600 flex-shrink-0" strokeWidth={2.2} />
              )}
              <span className={c.ok ? "text-slate-800" : "text-red-600"}>{c.msg}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main bid workspace ───────────────────────────────────── */
export function BidWorkspace() {
  const {
    activeTender,
    bidStep,
    setBidStep,
    goTo,
    openTenderClarif,
    clarifications,
    ackedDocs,
    uploadedFiles,
    selectedOptions,
    bidItems,
  } = useStore();

  const t = activeTender;

  if (t.awarded_to_us && t.status === "AWARDED" && t.type !== "RFI") {
    return <AwardScreen />;
  }

  const isRFI = t.type === "RFI";
  const STEPS = isRFI ? RFI_STEPS : ALL_STEPS;

  const totalBid = bidItems.reduce((s, it) => s + parseFloat(it.unit_price || "0") * it.quantity, 0);
  const tClarifs = clarifications.filter((c) => c.tender_id === t.id);
  const ndaAcked = ackedDocs["NDA_Agreement.pdf"];

  const answeredQ = Object.keys(uploadedFiles).length + Object.keys(selectedOptions).length + 1;
  const totalQ = qSections.reduce((s, sec) => s + sec.questions.length, 0);
  const compPct = Math.round((answeredQ / totalQ) * 100);

  const statusVariant =
    t.my_status === "INVITED" ? "invited" : t.my_status === "ACCEPTED" ? "accepted" : "submitted";

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 overflow-y-auto p-6 pb-0">
        {/* Bid header card */}
        <div className="bg-white border border-black/8 rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TypeTag type={t.type} />
                <span className="font-mono text-[11px] text-slate-400">{t.number}</span>
                <span className={cn(
                  "text-[10.5px] font-medium px-2 py-0.5 rounded-full",
                  statusVariant === "invited" ? "bg-indigo-50 text-indigo-700" :
                  statusVariant === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-green-100 text-green-700"
                )}>
                  {t.my_status}
                </span>
              </div>
              <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mb-0.5">{t.title}</h2>
              <p className="text-[12px] text-slate-500">{t.buyer} · Deadline: {t.deadline}</p>
            </div>
            {totalBid > 0 && (
              <div className="text-right">
                <div className="text-[18px] font-semibold text-slate-900 tracking-tight">{fmtAmount(totalBid)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Current bid total</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-[11.5px] text-slate-600">
            {t.two_envelope && t.type !== "RFI" && (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Two-envelope — Financial opens 15 Oct 2025
              </span>
            )}
            {t.bid_bond_req && t.type !== "RFI" && (
              <span className="flex items-center gap-1 text-amber-600">
                ★ Bid bond required
              </span>
            )}
            {t.nda_required && (
              <span className={cn("flex items-center gap-1", t.nda_signed ? "text-emerald-700" : "text-red-600")}>
                <CheckCircle className="w-3 h-3" /> NDA {t.nda_signed ? "signed" : "required"}
              </span>
            )}
          </div>
        </div>

        {/* NDA gate */}
        {t.nda_required && !ndaAcked && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700 mb-4">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <div>
              <strong>NDA acknowledgement required</strong> — You must acknowledge the NDA before accessing specifications or submitting a bid.
            </div>
          </div>
        )}

        {/* Corrigendum notice */}
        <div className="flex items-start gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 mb-4">
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Corrigendum issued</strong> — Technical specification v2.1 has been updated. Please review the latest documents before pricing.
          </div>
        </div>

        {/* Deadline strip */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <strong>Closes {t.deadline}</strong>
            {t.clarDeadline && (
              <span className="text-[11px] ml-3">Clarifications: {t.clarDeadline}</span>
            )}
          </div>
          <Button variant="amber" size="sm" onClick={() => openTenderClarif(t.id)}>
            <MessageSquare className="w-3 h-3" /> Q&A ({tClarifs.length})
          </Button>
        </div>

        {/* Step nav */}
        <div className="flex gap-0 bg-slate-100 rounded-lg p-0.5 mb-5">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setBidStep(i)}
              className={cn(
                "flex-1 py-1.5 text-center text-[12px] rounded-md cursor-pointer transition-all flex items-center justify-center gap-1",
                i === bidStep
                  ? "bg-white text-emerald-700 font-semibold shadow-xs"
                  : i < bidStep
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {i < bidStep && <CheckCircle className="w-2.5 h-2.5" />}
              {s}
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="pb-6">
          {bidStep === 0 && <DocsStep />}
          {bidStep === 1 && <QuestionnaireStep />}
          {!isRFI && bidStep === 2 && <LineItemsStep />}
          {(isRFI ? bidStep === 2 : bidStep === 3) && <ReviewStep />}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.05)] z-10">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Auto-saved · Draft
        </div>
        <div className="flex gap-2">
          {bidStep > 0 && (
            <Button onClick={() => setBidStep(bidStep - 1)}>← Previous</Button>
          )}
          {bidStep < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setBidStep(bidStep + 1)}>
              Next →
            </Button>
          ) : (
            <SubmitButton compPct={compPct} />
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ compPct }: { compPct: number }) {
  const { activeTender, ackedDocs, bidItems, goTo } = useStore();
  const [submitted, setSubmitted] = React.useState(false);

  const isRFI = activeTender.type === "RFI";
  const allAcked = tenderDocuments.filter((d) => d.ack_req).every((d) => ackedDocs[d.name]);
  const allPriced = isRFI || bidItems.every((it) => parseFloat(it.unit_price || "0") > 0);

  const handleSubmit = () => {
    setSubmitted(true);
    // Show inline success, redirect after delay
    setTimeout(() => goTo("tenders"), 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-emerald-700 font-medium">
        <CheckCircle className="w-4 h-4" /> Bid submitted — ref: RFP-2025-0018-SUB-004
      </div>
    );
  }

  return (
    <Button variant="primary" onClick={handleSubmit}>
      {isRFI ? "Submit response" : "Submit bid"}
    </Button>
  );
}
