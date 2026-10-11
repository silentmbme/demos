import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

export function Alert({
  title,
  children,
  tone = "info",
  variant = "soft",
  icon: Icon,
  action,
  onDismiss,
  className,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  tone?: Tone;
  variant?: "soft" | "solid" | "outline" | "accent";
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const colors: Record<string, Record<Tone, string>> = {
    soft: {
      info: "bg-info/10 text-foreground",
      success: "bg-success/10 text-foreground",
      warning: "bg-warning/12 text-foreground",
      danger: "bg-destructive/10 text-foreground",
    },
    solid: {
      info: "bg-info text-white",
      success: "bg-success text-white",
      warning: "bg-warning text-white",
      danger: "bg-destructive text-white",
    },
    outline: {
      info: "border-info/35 bg-card",
      success: "border-success/35 bg-card",
      warning: "border-warning/40 bg-card",
      danger: "border-destructive/35 bg-card",
    },
    accent: {
      info: "border-s-4 border-s-info bg-info/7",
      success: "border-s-4 border-s-success bg-success/7",
      warning: "border-s-4 border-s-warning bg-warning/8",
      danger: "border-s-4 border-s-destructive bg-destructive/7",
    },
  };

  const iconColors: Record<Tone, string> = {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-transparent p-4 text-sm",
        colors[variant][tone],
        className,
      )}
    >
      <span
        className={cn("mt-0.5 shrink-0", variant === "solid" ? "text-current" : iconColors[tone])}
      >
        {Icon && <Icon className="size-5" />}
      </span>

      <span className="min-w-0 flex-1">
        {title && <b className="block">{title}</b>}

        <span
          className={cn(
            "block leading-6",
            title && "mt-0.5",
            variant === "solid" ? "text-current/90" : "text-muted-foreground",
          )}
        >
          {children}
        </span>

        {action && <span className="mt-3 flex flex-wrap gap-2">{action}</span>}
      </span>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onDismiss}
          className="shrink-0 opacity-70 transition hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
