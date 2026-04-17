import { StoreProvider } from "./store";
import { PortalShell } from "./PortalShell";

export const metadata = {
  title: "ProcureFlow — Supplier Portal",
  description: "Enterprise supplier portal for managing tenders, bids, and clarifications",
};

export default function SupplierPortalPage() {
  return (
    <StoreProvider>
      <PortalShell />
    </StoreProvider>
  );
}
