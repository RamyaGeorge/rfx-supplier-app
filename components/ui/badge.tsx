import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-[10.5px] font-medium px-2 py-0.5 whitespace-nowrap",
  {
    variants: {
      variant: {
        invited: "bg-indigo-50 text-indigo-700",
        accepted: "bg-emerald-50 text-emerald-700",
        submitted: "bg-green-100 text-green-700",
        draft: "bg-slate-100 text-slate-500",
        published: "bg-blue-50 text-blue-700",
        closed: "bg-amber-50 text-amber-700",
        awarded: "bg-emerald-50 text-emerald-800 border border-emerald-300",
        open: "bg-emerald-50 text-emerald-700",
        cancelled: "bg-red-50 text-red-700",
        disqualified: "bg-amber-50 text-amber-700",
        withdrawn: "bg-slate-100 text-slate-500",
        pending: "bg-amber-50 text-amber-700 border border-amber-300",
        answered: "bg-emerald-50 text-emerald-700 border border-emerald-300",
        broadcast: "bg-blue-50 text-blue-700 border border-blue-200",
        mine: "bg-violet-50 text-violet-700 border border-violet-200",
      },
    },
    defaultVariants: { variant: "draft" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
