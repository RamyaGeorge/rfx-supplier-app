"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Tender,
  BidItem,
  Clarification,
  Notification,
  initialTenders,
  initialBidItems,
  initialClarifications,
  initialNotifications,
} from "./data";

export type Page = "tenders" | "bid" | "submissions" | "clarifications" | "notifications" | "profile" | "settings" | "dashboard";

interface StoreState {
  page: Page;
  bidStep: number;
  activeTender: Tender;
  tenders: Tender[];
  bidItems: BidItem[];
  selectedOptions: Record<string, string>;
  uploadedFiles: Record<string, boolean>;
  ackedDocs: Record<string, boolean>;
  clarifications: Clarification[];
  notifications: Notification[];
  activeClarifTenderId: number;
  clarifFilter: "ALL" | "MINE" | "ANSWERED" | "PENDING";
  clarifComposeOpen: boolean;
  clarifComposeAnonymous: boolean;
  ndaModalTenderId: number | null;

  goTo: (p: Page) => void;
  openTender: (id: number) => void;
  openTenderClarif: (tenderId: number) => void;
  setBidStep: (s: number) => void;
  acceptInvite: (id: number) => void;
  declineInvite: (id: number) => void;
  signNda: (id: number) => void;
  dismissNdaModal: () => void;
  ackDoc: (name: string) => void;
  toggleUpload: (qid: string) => void;
  selectOpt: (qid: string, val: string) => void;
  markAllRead: () => void;
  setClarifFilter: (f: "ALL" | "MINE" | "ANSWERED" | "PENDING") => void;
  toggleCompose: () => void;
  setClarifAnon: (v: boolean) => void;
  submitQuestion: (text: string) => void;
  updateBidItem: (index: number, field: keyof BidItem, value: string) => void;
  setSelectedOption: (qid: string, val: string) => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>("tenders");
  const [bidStep, setBidStepState] = useState(0);
  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [activeTender, setActiveTender] = useState<Tender>(initialTenders[0]);
  const [bidItems, setBidItems] = useState<BidItem[]>(initialBidItems);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    q3: "India (domestic)",
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({ q1: true });
  const [ackedDocs, setAckedDocs] = useState<Record<string, boolean>>({});
  const [clarifications, setClarifications] = useState<Clarification[]>(initialClarifications);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeClarifTenderId, setActiveClarifTenderId] = useState(1);
  const [clarifFilter, setClarifFilterState] = useState<"ALL" | "MINE" | "ANSWERED" | "PENDING">("ALL");
  const [clarifComposeOpen, setClarifComposeOpen] = useState(false);
  const [clarifComposeAnonymous, setClarifComposeAnonymous] = useState(false);
  const [ndaModalTenderId, setNdaModalTenderId] = useState<number | null>(null);

  const goTo = (p: Page) => {
    setPage(p);
    setBidStepState(0);
  };

  const openTender = (id: number) => {
    const t = tenders.find((t) => t.id === id);
    if (t) setActiveTender(t);
    setPage("bid");
    setBidStepState(0);
  };

  const openTenderClarif = (tenderId: number) => {
    setActiveClarifTenderId(tenderId);
    setClarifFilterState("ALL");
    setClarifComposeOpen(false);
    setPage("clarifications");
  };

  const setBidStep = (s: number) => setBidStepState(s);

  const acceptInvite = (id: number) => {
    const t = tenders.find((t) => t.id === id);
    if (t && t.nda_required && !t.nda_signed) {
      setNdaModalTenderId(id);
      return;
    }
    setTenders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, my_status: "ACCEPTED" } : t))
    );
  };

  const signNda = (id: number) => {
    setNdaModalTenderId(null);
    setTenders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, nda_signed: true, my_status: "ACCEPTED" } : t))
    );
  };

  const declineInvite = (id: number) => {
    setTenders((prev) =>
      prev.map((t) => (t.id === id ? { ...t, my_status: "WITHDRAWN" } : t))
    );
  };

  const dismissNdaModal = () => setNdaModalTenderId(null);

  const ackDoc = (name: string) => {
    setAckedDocs((prev) => ({ ...prev, [name]: true }));
  };

  const toggleUpload = (qid: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      if (next[qid]) delete next[qid];
      else next[qid] = true;
      return next;
    });
  };

  const selectOpt = (qid: string, val: string) => {
    setSelectedOptions((prev) => ({ ...prev, [qid]: val }));
  };

  const setSelectedOption = selectOpt;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const setClarifFilter = (f: "ALL" | "MINE" | "ANSWERED" | "PENDING") => {
    setClarifFilterState(f);
  };

  const toggleCompose = () => setClarifComposeOpen((v) => !v);
  const setClarifAnon = (v: boolean) => setClarifComposeAnonymous(v);

  const submitQuestion = (text: string) => {
    if (!text.trim()) return;
    const newQ: Clarification = {
      id: clarifications.length + 1,
      tender_id: activeClarifTenderId,
      question: text,
      answer: null,
      asked: "Just now",
      answered: null,
      answeredBy: null,
      anonymous: clarifComposeAnonymous,
      isMine: true,
      broadcast: false,
      status: "PENDING",
    };
    setClarifications((prev) => [...prev, newQ]);
    setClarifComposeOpen(false);
    setClarifComposeAnonymous(false);
  };

  const updateBidItem = (index: number, field: keyof BidItem, value: string) => {
    setBidItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        page,
        bidStep,
        activeTender,
        tenders,
        bidItems,
        selectedOptions,
        uploadedFiles,
        ackedDocs,
        clarifications,
        notifications,
        activeClarifTenderId,
        clarifFilter,
        clarifComposeOpen,
        clarifComposeAnonymous,
        ndaModalTenderId,
        goTo,
        openTender,
        openTenderClarif,
        setBidStep,
        acceptInvite,
        declineInvite,
        signNda,
        dismissNdaModal,
        ackDoc,
        toggleUpload,
        selectOpt,
        markAllRead,
        setClarifFilter,
        toggleCompose,
        setClarifAnon,
        submitQuestion,
        updateBidItem,
        setSelectedOption,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
