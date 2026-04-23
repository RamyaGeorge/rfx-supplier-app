export type TenderStatus = "INVITED" | "ACCEPTED" | "SUBMITTED" | "WITHDRAWN" | "DISQUALIFIED";
export type EventStatus = "PUBLISHED" | "CLOSED" | "AWARDED";
export type TenderType = "RFI" | "RFP" | "RFQ";

export interface Tender {
  id: number;
  title: string;
  number: string;
  type: TenderType;
  buyer: string;
  status: EventStatus;
  deadline: string;
  clarDeadline: string;
  my_status: TenderStatus;
  estimated: string;
  daysLeft: number;
  nda_required: boolean;
  nda_signed: boolean;
  intent_req: boolean;
  intent_declared: boolean;
  bid_bond_req: boolean;
  two_envelope: boolean;
  urgent: boolean;
  progress: number;
  bid_amount?: number;
  awarded_to_us?: boolean;
  award_amount?: number;
  award_date?: string;
  contract_months?: number;
}

export interface BidItem {
  id: number;
  item_code: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: string;
  lead_time_days: string;
  brand: string;
  model_no: string;
  country_of_origin: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  type: "FILE_UPLOAD" | "NUMERIC" | "SINGLE_CHOICE" | "BOOLEAN" | "TEXT";
  mandatory: boolean;
  scored: boolean;
  weight?: number;
  hint?: string;
  options?: string[];
}

export interface QSection {
  id: number;
  title: string;
  type: string;
  mandatory: boolean;
  questions: QuestionOption[];
}

export interface Clarification {
  id: number;
  tender_id: number;
  question: string;
  answer: string | null;
  asked: string;
  answered: string | null;
  answeredBy: string | null;
  anonymous: boolean;
  isMine: boolean;
  broadcast: boolean;
  status: "ANSWERED" | "PENDING";
}

export interface TenderDocument {
  name: string;
  type: string;
  size: string;
  ack_req: boolean;
}

export interface Notification {
  id: number;
  key: string;
  text: string;
  time: string;
  read: boolean;
  tender_id?: number;
}

export const initialTenders: Tender[] = [
  {
    id: 1,
    title: "Annual Decorative Lighting Contract – Phase 2",
    number: "RFP-2025-0018",
    type: "RFP",
    buyer: "ACME Corp",
    status: "PUBLISHED",
    deadline: "30 Sep 2025",
    clarDeadline: "15 Sep 2025",
    my_status: "INVITED",
    estimated: "₹50,00,000",
    daysLeft: 13,
    nda_required: true,
    nda_signed: true,
    intent_req: true,
    intent_declared: false,
    bid_bond_req: true,
    two_envelope: true,
    urgent: true,
    progress: 0,
  },
  {
    id: 2,
    title: "IT Hardware Procurement 2025",
    number: "RFQ-2025-0039",
    type: "RFQ",
    buyer: "ACME Corp",
    status: "PUBLISHED",
    deadline: "15 Oct 2025",
    clarDeadline: "",
    my_status: "ACCEPTED",
    estimated: "₹12,50,000",
    daysLeft: 28,
    nda_required: false,
    nda_signed: false,
    intent_req: false,
    intent_declared: false,
    bid_bond_req: false,
    two_envelope: false,
    urgent: false,
    progress: 35,
  },
  {
    id: 3,
    title: "Office Electrical Maintenance 2025",
    number: "RFQ-2025-0031",
    type: "RFQ",
    buyer: "TechBuild Ltd",
    status: "CLOSED",
    deadline: "01 Jun 2025",
    clarDeadline: "",
    my_status: "SUBMITTED",
    estimated: "₹8,00,000",
    daysLeft: 0,
    nda_required: false,
    nda_signed: false,
    intent_req: false,
    intent_declared: false,
    bid_bond_req: false,
    two_envelope: false,
    urgent: false,
    progress: 100,
    bid_amount: 795000,
  },
  {
    id: 5,
    title: "Smart Building Infrastructure Assessment",
    number: "RFI-2025-0021",
    type: "RFI",
    buyer: "GreenBuild Corp",
    status: "PUBLISHED",
    deadline: "20 Oct 2025",
    clarDeadline: "10 Oct 2025",
    my_status: "INVITED",
    estimated: "₹35,00,000",
    daysLeft: 20,
    nda_required: false,
    nda_signed: false,
    intent_req: false,
    intent_declared: false,
    bid_bond_req: false,
    two_envelope: false,
    urgent: false,
    progress: 0,
  },
  {
    id: 4,
    title: "Campus Lighting Overhaul",
    number: "RFP-2025-0005",
    type: "RFP",
    buyer: "NovaTech Infra",
    status: "AWARDED",
    deadline: "10 Mar 2025",
    clarDeadline: "",
    my_status: "SUBMITTED",
    estimated: "₹2,10,00,000",
    daysLeft: 0,
    nda_required: true,
    nda_signed: true,
    intent_req: true,
    intent_declared: true,
    bid_bond_req: true,
    two_envelope: true,
    urgent: false,
    awarded_to_us: true,
    progress: 100,
    bid_amount: 21000000,
    award_amount: 21000000,
    award_date: "20 Oct 2025",
    contract_months: 24,
  },
];

export const initialBidItems: BidItem[] = [
  {
    id: 1,
    item_code: "LT-BRASS-001",
    description: "Custom Brass Wall Sconce",
    quantity: 500,
    unit: "PCS",
    unit_price: "1050.00",
    lead_time_days: "42",
    brand: "Lumify",
    model_no: "BW-E27-500",
    country_of_origin: "IN",
  },
  {
    id: 2,
    item_code: "LT-LED-002",
    description: "LED Retrofit Bulb 10W E27",
    quantity: 2000,
    unit: "PCS",
    unit_price: "162.00",
    lead_time_days: "30",
    brand: "Lumify",
    model_no: "RL-10W-E27",
    country_of_origin: "IN",
  },
];

export const qSections: QSection[] = [
  {
    id: 1,
    title: "Technical Compliance",
    type: "TECHNICAL",
    mandatory: true,
    questions: [
      {
        id: "q1",
        text: "Upload valid Material Certification (IS 9900:2002)",
        type: "FILE_UPLOAD",
        mandatory: true,
        scored: false,
        hint: "Upload PDF or image of your IS 9900:2002 certification.",
      },
      {
        id: "q2",
        text: "Warranty Period Offered (months)",
        type: "NUMERIC",
        mandatory: true,
        scored: true,
        weight: 15,
        hint: "Minimum 12 months. Higher warranty improves your technical score.",
      },
      {
        id: "q3",
        text: "Manufacturing facility location",
        type: "SINGLE_CHOICE",
        mandatory: true,
        scored: true,
        weight: 10,
        options: ["India (domestic)", "China", "Europe", "Other"],
      },
    ],
  },
  {
    id: 2,
    title: "Company Profile",
    type: "GENERAL",
    mandatory: true,
    questions: [
      {
        id: "q4",
        text: "Years in business",
        type: "NUMERIC",
        mandatory: true,
        scored: false,
        hint: "Number of years your company has been operating.",
      },
      {
        id: "q5",
        text: "ISO 9001:2015 Certified?",
        type: "BOOLEAN",
        mandatory: true,
        scored: true,
        weight: 8,
        hint: "",
      },
    ],
  },
  {
    id: 3,
    title: "HSE Compliance",
    type: "HSE",
    mandatory: false,
    questions: [
      {
        id: "q6",
        text: "Upload current HSE policy document",
        type: "FILE_UPLOAD",
        mandatory: false,
        scored: false,
        hint: "Upload your company HSE policy (PDF).",
      },
    ],
  },
];

export const initialClarifications: Clarification[] = [
  {
    id: 1,
    tender_id: 1,
    question:
      "Please clarify whether IP44 rating is mandatory for indoor wall sconces installed in dry locations.",
    answer:
      "IP44 rating is mandatory for all installations regardless of location as per project specification clause 3.2.1. Please ensure all submitted products carry valid IP44 certification.",
    asked: "25 Aug 2025",
    answered: "26 Aug 2025",
    answeredBy: "ACME Corp – Procurement Team",
    anonymous: true,
    isMine: true,
    broadcast: true,
    status: "ANSWERED",
  },
  {
    id: 2,
    tender_id: 1,
    question:
      "Can we offer equivalent products if the specified model is out of stock?",
    answer:
      "Equivalent products are acceptable provided they meet all technical specifications. Please clearly state deviations in the deviation_notes field for each line item.",
    asked: "28 Aug 2025",
    answered: "29 Aug 2025",
    answeredBy: "ACME Corp – Procurement Team",
    anonymous: false,
    isMine: false,
    broadcast: true,
    status: "ANSWERED",
  },
  {
    id: 3,
    tender_id: 1,
    question:
      "What is the acceptable tolerance for the brass finish colour temperature (warm white vs neutral white) on the wall sconces?",
    answer: null,
    asked: "02 Sep 2025",
    answered: null,
    answeredBy: null,
    anonymous: false,
    isMine: true,
    broadcast: false,
    status: "PENDING",
  },
  {
    id: 4,
    tender_id: 1,
    question:
      "Is there a specific BIS-approved testing laboratory whose certification will be accepted, or will any accredited NABL lab suffice?",
    answer: null,
    asked: "05 Sep 2025",
    answered: null,
    answeredBy: null,
    anonymous: true,
    isMine: true,
    broadcast: false,
    status: "PENDING",
  },
  {
    id: 5,
    tender_id: 2,
    question:
      "Can the laptop specifications be substituted with an equivalent model from a different OEM if the exact SKU is unavailable at the time of delivery?",
    answer:
      "Yes, equivalent-or-better substitutions are permitted subject to prior written approval from the IT department. Please raise a deviation request at the time of order.",
    asked: "20 Sep 2025",
    answered: "21 Sep 2025",
    answeredBy: "ACME Corp – IT Procurement",
    anonymous: false,
    isMine: true,
    broadcast: true,
    status: "ANSWERED",
  },
];

export const tenderDocuments: TenderDocument[] = [
  { name: "NDA_Agreement.pdf", type: "NDA", size: "184 KB", ack_req: true },
  { name: "Tech_Specification_v2.1.pdf", type: "RFX_DOCUMENT", size: "2.1 MB", ack_req: false },
  { name: "Terms_and_Conditions.pdf", type: "TERMS_CONDITIONS", size: "412 KB", ack_req: true },
  { name: "BOQ_Template.xlsx", type: "BOQ", size: "88 KB", ack_req: false },
];

export const initialNotifications: Notification[] = [
  {
    id: 1,
    key: "NEGO_ROUND_OPENED",
    text: "Round 2 of price negotiation for RFP-2025-0018 is now open. Deadline: 17 Oct 2025.",
    time: "2 hours ago",
    read: false,
    tender_id: 1,
  },
  {
    id: 2,
    key: "EVT_CORRIGENDUM",
    text: "Corrigendum issued for RFP-2025-0018 – Technical specification updated. Please review the latest documents.",
    time: "1 day ago",
    read: false,
    tender_id: 1,
  },
  {
    id: 3,
    key: "CLARIF_PUBLISHED",
    text: "New Q&A published for RFP-2025-0018. 2 questions have been answered by the buyer.",
    time: "3 days ago",
    read: false,
    tender_id: 1,
  },
  {
    id: 4,
    key: "SUP_INVITED",
    text: "You have been invited to bid on RFQ-2025-0039 – IT Hardware Procurement 2025.",
    time: "5 days ago",
    read: true,
    tender_id: 2,
  },
  {
    id: 5,
    key: "SUP_AWARDED",
    text: "Congratulations! ABC Lighting Co. has been awarded Campus Lighting Overhaul (RFP-2025-0005).",
    time: "2 months ago",
    read: true,
    tender_id: 4,
  },
];

export function fmtAmount(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
