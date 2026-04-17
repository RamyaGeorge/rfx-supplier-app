"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98] cursor-pointer border",
  {
    variants: {
      variant: {
        default: "bg-white border-black/12 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        primary: "bg-[#065E45] border-[#065E45] text-white hover:bg-[#0D8C65] hover:border-[#0D8C65]",
        ghost: "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
        amber: "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100",
        outline: "bg-transparent border-slate-200 text-slate-700 hover:bg-slate-50",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2.5 py-1 text-[11px]",
        icon: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
