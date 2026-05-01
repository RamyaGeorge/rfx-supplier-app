"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "./store";

export function NdaModal() {
  const { ndaModalTenderId, tenders, signNda, declineNda, dismissNdaModal } = useStore();
  const [agreed, setAgreed] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  if (ndaModalTenderId === null) return null;

  const tender = tenders.find((t) => t.id === ndaModalTenderId);
  if (!tender) return null;

  const handleSign = () => {
    if (!agreed) return;
    setAgreed(false);
    signNda(ndaModalTenderId);
  };

  const handleDismiss = () => {
    setAgreed(false);
    setShowDecline(false);
    setDeclineReason("");
    dismissNdaModal();
  };

  const handleDeclineSubmit = () => {
    if (!declineReason.trim()) return;
    declineNda(ndaModalTenderId, declineReason.trim());
    setShowDecline(false);
    setDeclineReason("");
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-slate-900">
                Non-Disclosure Agreement
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{tender.number}</div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[12.5px] text-slate-600 mb-4 leading-relaxed">
            <strong className="text-slate-800">{tender.buyer}</strong> requires you to accept a
            Non-Disclosure Agreement before accepting this invitation.
          </p>

          <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-slate-900">{tender.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Deadline: {tender.deadline} · Est. value: {tender.estimated}
              </div>
            </div>
          </div>

          {/* NDA text scroll area */}
          <div className="border border-black/8 rounded-xl bg-slate-50 p-4 h-48 overflow-y-auto text-[11.5px] text-slate-600 leading-relaxed mb-4 space-y-3">
            <p><strong>NON-DISCLOSURE AGREEMENT</strong></p>
            <p>
              This Non-Disclosure Agreement (&ldquo;Agreement&rdquo;) is entered into between{" "}
              <strong>{tender.buyer}</strong> (&ldquo;Disclosing Party&rdquo;) and the Supplier
              entity identified in the ProcureFlow portal (&ldquo;Receiving Party&rdquo;) in
              connection with procurement event <strong>{tender.number}</strong>.
            </p>
            <p>
              <strong>1. Confidential Information.</strong> &ldquo;Confidential Information&rdquo;
              means all technical, commercial, and financial information disclosed by the Disclosing
              Party in connection with this event, whether in oral, written, or electronic form.
            </p>
            <p>
              <strong>2. Obligations.</strong> The Receiving Party agrees to: (a) hold Confidential
              Information in strict confidence; (b) use it solely to evaluate and respond to this
              procurement event; (c) not disclose it to any third party without prior written
              consent; and (d) limit internal disclosure to personnel who have a need to know.
            </p>
            <p>
              <strong>3. Term.</strong> This Agreement remains in effect for three (3) years from
              the date of acceptance, unless the Disclosing Party provides written notice of an
              earlier termination.
            </p>
            <p>
              <strong>4. Return of Information.</strong> Upon request or on conclusion of the
              procurement process, the Receiving Party shall promptly return or destroy all
              Confidential Information.
            </p>
            <p>
              <strong>5. No Licence.</strong> Nothing in this Agreement grants any licence, right,
              or interest in any intellectual property of the Disclosing Party.
            </p>
            <p>
              <strong>6. Governing Law.</strong> This Agreement shall be governed by the laws of
              the jurisdiction in which the Disclosing Party is incorporated.
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-[12px] text-slate-700 leading-relaxed">
              I have read and understood the Non-Disclosure Agreement and I accept its terms on
              behalf of my organisation. I confirm I am authorised to bind my organisation to this
              Agreement.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-black/8 bg-slate-50/60">
          <Button variant="default" size="sm" onClick={handleDismiss}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDecline(true)}>
            Don&apos;t Accept
          </Button>
          <Button variant="primary" size="sm" disabled={!agreed} onClick={handleSign}>
            <Shield className="w-3.5 h-3.5" />
            Accept &amp; proceed
          </Button>
        </div>
      </div>
    </div>

    {/* Decline reason popup */}
    {showDecline && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-[13.5px] font-semibold text-slate-900">Reason for not accepting</span>
            </div>
            <button
              onClick={() => { setShowDecline(false); setDeclineReason(""); }}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-3">
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Please provide a reason for declining the NDA. This will be sent to the procurement team at{" "}
              <strong className="text-slate-700">{tender.buyer}</strong>.
            </p>
            <textarea
              autoFocus
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
              placeholder="e.g. The confidentiality terms are too broad for our organisation…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-black/8 bg-slate-50/60">
            <Button variant="default" size="sm" onClick={() => { setShowDecline(false); setDeclineReason(""); }}>
              Back
            </Button>
            <Button variant="danger" size="sm" disabled={!declineReason.trim()} onClick={handleDeclineSubmit}>
              Submit &amp; decline
            </Button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
