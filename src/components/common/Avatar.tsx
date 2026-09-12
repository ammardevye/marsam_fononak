import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function Avatar({ className, src, alt = "", fallback = "?", size = "md", ...props }: AvatarProps) {
  const sizeStyles = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-surface-secondary",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "xl" ? 64 : size === "lg" ? 48 : size === "sm" ? 32 : 40}
          height={size === "xl" ? 64 : size === "lg" ? 48 : size === "sm" ? 32 : 40}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-secondary text-text-muted">
          {fallback.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export { Avatar };
