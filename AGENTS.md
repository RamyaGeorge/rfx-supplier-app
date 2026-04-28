<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# RFX Supplier Portal — Agent Reference

## Project Overview

**ProcureFlow Supplier Portal** is a Next.js 16 (App Router) frontend application for enterprise procurement. Suppliers use it to:

- Browse and respond to tender invitations (RFI, RFP, RFQ, RFT)
- Submit bids through a 4-step guided workflow (documents → questionnaire → line items → review)
- Send and receive clarification Q&A on tender requirements
- Track submissions and contract awards
- Receive activity notifications

This is a **frontend-only prototype** — all data is mocked. There is no backend, no database, and no authentication system yet. Currency is formatted as Indian Rupees (₹).

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI Runtime | React 19.2.4 |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 4.x via `@tailwindcss/postcss` |
| Component variants | class-variance-authority (CVA) 0.7.1 |
| Class merging | clsx 2.1.1 + tailwind-merge 3.5.0 |
| Headless UI | Radix UI (Dialog, Tabs, Select, ScrollArea, Separator, Tooltip, Slot) |
| Icons | lucide-react 1.8.0 |
| Linting | ESLint 9.x with Next.js + TypeScript rules |

**Important:** Next.js 16 uses the App Router. There are no `pages/` directory routes. All routing is via the `app/` directory with `layout.tsx` / `page.tsx` files.

---

## Directory Structure

```
rfx-supplier-app/
├── app/
│   ├── layout.tsx                  Root layout — Montserrat font, metadata
│   ├── page.tsx                    Redirect → /supplier-portal
│   ├── globals.css                 Tailwind directives + custom utilities
│   └── supplier-portal/
│       ├── page.tsx                Entry point — wraps with StoreProvider
│       ├── PortalShell.tsx         Main shell: Topbar + Sidebar + page routing
│       ├── Sidebar.tsx             Left nav, hardcoded user "Rajesh Kumar"
│       ├── store.tsx               React Context — all app state + actions
│       ├── data.ts                 TypeScript types + all mock data
│       ├── TendersPage.tsx         Browse/filter tenders list
│       ├── BidWorkspace.tsx        4-step bid submission form
│       ├── SubmissionsPage.tsx     View past bids & award status
│       ├── ClarificationsPage.tsx  Q&A interface per tender
│       └── NotificationsPage.tsx   Activity feed
├── components/
│   └── ui/
│       ├── button.tsx              CVA button — variants: default, primary, ghost, danger, amber, outline
│       ├── badge.tsx               Status badges
│       ├── card.tsx                Card layout primitives
│       ├── scroll-area.tsx         Radix ScrollArea wrapper
│       ├── separator.tsx           Radix Separator wrapper
│       └── tabs.tsx                Radix Tabs wrapper
├── lib/
│   └── utils.ts                    cn() = clsx + twMerge
├── next.config.ts                  Empty (all defaults)
├── tsconfig.json                   Strict mode, @/* path alias
├── postcss.config.mjs              @tailwindcss/postcss
└── eslint.config.mjs               ESLint flat config
```

---

## Key Data Types (`app/supplier-portal/data.ts`)

```typescript
type TenderStatus = "INVITED" | "ACCEPTED" | "SUBMITTED" | "WITHDRAWN" | "DISQUALIFIED"
type EventStatus  = "PUBLISHED" | "CLOSED" | "AWARDED"
type TenderType   = "RFI" | "RFP" | "RFQ" | "RFT"

interface Tender {
  id, title, number, type: TenderType, buyer, status: EventStatus,
  deadline, clarDeadline, my_status: TenderStatus, estimated, daysLeft,
  nda_required, nda_signed, intent_req, intent_declared,
  bid_bond_req, two_envelope, urgent, progress,
  bid_amount?, awarded_to_us?, award_amount?, award_date?, contract_months?
}

interface BidItem {
  id, item_code, description, quantity, unit,
  unit_price, lead_time_days, brand, model_no, country_of_origin
}

type QuestionType = "FILE_UPLOAD" | "NUMERIC" | "SINGLE_CHOICE" | "BOOLEAN" | "TEXT"
interface QuestionOption { id, text, type: QuestionType, mandatory, scored, weight?, hint?, options? }
interface QSection { id, title, type: "TECHNICAL"|"GENERAL"|"HSE"|"COMPLIANCE", mandatory, questions[] }

interface Clarification {
  id, tender_id, question, answer?, asked, answered?, answeredBy?,
  anonymous, isMine, broadcast, status: "ANSWERED"|"PENDING"
}

interface TenderDocument { name, type: "NDA"|"RFX_DOCUMENT"|"TERMS_CONDITIONS"|"BOQ", size, ack_req }
interface Notification   { id, key, text, time, read, tender_id? }
```

The helper `fmtAmount(n: number): string` formats numbers as Indian Rupee strings (₹ with lakh/crore grouping).

---

## State Management (`app/supplier-portal/store.tsx`)

Single React Context + `useReducer`-style state. Wrap the app with `<StoreProvider>`. Access state and actions via `useStore()`.

Key state fields:

| Field | Purpose |
|---|---|
| `page` | Current page: `"tenders"` \| `"bid"` \| `"submissions"` \| `"clarifications"` \| `"notifications"` |
| `activeTenderId` | ID of tender open in BidWorkspace |
| `bidStep` | 0–3 (Documents, Questionnaire, Line Items, Review) |
| `tenders` | Array of `Tender` (mutated by acceptInvite, submitBid, etc.) |
| `bidItems` | Array of `BidItem` (editable line-item pricing) |
| `clarifications` | Array of `Clarification` |
| `notifications` | Array of `Notification` |
| `ackedDocs` | Set of acknowledged document names |
| `uploads` | Set of question IDs with uploaded files |
| `answers` | Map of questionId → answer value |
| `filterStatus` | Active tender list filter |

Key actions:

| Action | Effect |
|---|---|
| `goTo(page)` | Navigate to page |
| `openTender(id)` | Open BidWorkspace for tender, set `bidStep` to 0 |
| `setBidStep(n)` | Move to step n in bid workflow |
| `acceptInvite(id)` | Set tender `my_status` to `"ACCEPTED"` |
| `ackDoc(name)` | Add doc name to `ackedDocs` |
| `toggleUpload(qid)` | Toggle file-uploaded status for a question |
| `selectOpt(qid, val)` | Store answer for a questionnaire question |
| `updateBidItem(i, field, val)` | Edit a BidItem field |
| `submitQuestion(text)` | Add a new Clarification |
| `submitBid()` | Mark tender as submitted |

---

## Styling Conventions

- **All styling is Tailwind utility classes** — no CSS modules, no styled-components.
- **Color palette:** emerald (primary/success), slate (neutral), amber (warnings), red (danger), blue (info).
- **Custom utilities** defined in `globals.css`: `border-black/8`, `border-black/12`, `border-white/6`, `text-white/48`, `shadow-xs`.
- **Component variants** use CVA (`cva()`) in `components/ui/button.tsx` and `components/ui/badge.tsx`.
- **`cn()` utility** (`lib/utils.ts`) — always use this for conditional class merging, not template strings.
- **Desktop-only design** — no mobile breakpoints currently.

Button variants: `default`, `primary`, `ghost`, `danger`, `amber`, `outline`  
Badge variants: `invited`, `accepted`, `submitted`, `awarded`, `closed`, `pending`

---

## Coding Conventions

1. **All interactive components must include `"use client"` at the top.** Server Components are only used for layouts and the root `page.tsx` files.
2. **Path alias `@/*`** maps to the project root. Use it for all cross-directory imports (e.g., `@/components/ui/button`, `@/lib/utils`).
3. **No `any` types.** TypeScript strict mode is enforced. Define types in `data.ts` for domain objects.
4. **Status types are string union literals**, not TypeScript `enum`.
5. **Icons:** use `lucide-react` by default. If a lucide icon name conflicts with a local variable, define an aliased import (`import { Mail as EnvelopeIcon }`).
6. **No external form libraries.** Forms use controlled `<input>` / `<select>` with `onChange` handlers.
7. **Mock data lives in `data.ts`.** Do not scatter mock data across page components.
8. **No comments** unless the *why* is non-obvious (hidden constraints, workarounds, subtle invariants).

---

## Authentication

Not implemented. All pages are publicly accessible. The user identity is hardcoded as:

- **Name:** Rajesh Kumar  
- **Company:** ABC Lighting Co.  
- **Role:** Supplier

When adding auth, wrap with a provider above `StoreProvider` in `app/supplier-portal/page.tsx`.

---

## Environment Variables

None are currently used. When adding backend integration, define variables in `.env.local` and prefix public ones with `NEXT_PUBLIC_`. Create a `.env.example` to document required variables.

---

## Available Scripts

```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # Run ESLint
```

---

## What Does Not Exist Yet

- Backend / API routes — no `app/api/` directory
- Real authentication (no Clerk, Auth.js, or custom session)
- Database (no Prisma, Drizzle, or direct DB access)
- File upload handling (uploads are simulated with state toggles)
- Real-time notifications (no WebSocket or Server-Sent Events)
- Email or notification services
- Payment/bid bond verification
- Mobile-responsive layouts
- Unit or integration tests
- Environment variable configuration
