import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground",
    secondary: "bg-surface-secondary text-text-muted",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    error: "bg-error text-error-foreground",
    info: "bg-info text-info-foreground",
    outline: "border border-border text-text",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
