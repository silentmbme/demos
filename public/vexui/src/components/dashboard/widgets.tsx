import * as Icons from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { sparklineOptions, token } from "@/lib/chart-config";
import { cn } from "@/lib/utils";
import { getUserImage } from "@/lib/user-images";

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb && (
          <nav
            aria-label="Breadcrumb"
            className="mb-1.5 flex items-center gap-1.5 flex-wrap text-[12.5px] text-muted-foreground"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <Icons.ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />}
                <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[26px] font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("vexui-card flex min-w-0 flex-col", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border flex-wrap px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn("min-w-0 flex-1 p-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Delta({ value, caption }: { value: number; caption?: string }) {
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-1 text-[12.5px]">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
          up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
        )}
      >
        {up ? (
          <Icons.TrendingUp className="size-3.5" />
        ) : (
          <Icons.TrendingDown className="size-3.5" />
        )}
        {up ? "+" : ""}
        {value}%
      </span>
      {caption && <span className="text-muted-foreground">{caption}</span>}
    </span>
  );
}

export function Badge({
  children,
  tone = "muted",
  variant = "soft",
  size = "default",
  onRemove,
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "danger" | "info";
  variant?: "soft" | "solid" | "outline" | "dot";
  size?: "sm" | "default" | "lg";
  onRemove?: () => void;
}) {
  const tones: Record<string, Record<string, string>> = {
    soft: {
      muted: "bg-muted text-muted-foreground",
      primary: "bg-primary/12 text-primary",
      success: "bg-success/14 text-success",
      warning: "bg-warning/16 text-warning",
      danger: "bg-destructive/12 text-destructive",
      info: "bg-info/14 text-info",
    },
    solid: {
      muted: "bg-muted-foreground text-background",
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-white",
      warning: "bg-warning text-white",
      danger: "bg-destructive text-destructive-foreground",
      info: "bg-info text-white",
    },
    outline: {
      muted: "border border-border text-muted-foreground",
      primary: "border border-primary/35 text-primary",
      success: "border border-success/35 text-success",
      warning: "border border-warning/40 text-warning",
      danger: "border border-destructive/35 text-destructive",
      info: "border border-info/35 text-info",
    },
    dot: {
      muted: "bg-muted text-muted-foreground",
      primary: "bg-muted text-foreground",
      success: "bg-muted text-foreground",
      warning: "bg-muted text-foreground",
      danger: "bg-muted text-foreground",
      info: "bg-muted text-foreground",
    },
  };
  const dots: Record<string, string> = {
    muted: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
  };
  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    default: "px-2 py-0.5 text-[11.5px]",
    lg: "px-2.5 py-1 text-xs",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        tones[variant][tone],
        sizes[size],
      )}
    >
      {variant === "dot" && <span className={cn("size-1.5 rounded-full", dots[tone])} />}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove tag"
          onClick={onRemove}
          className="ms-0.5 rounded-full opacity-70 transition hover:opacity-100"
        ></button>
      )}
    </span>
  );
}
/** KPI style 1 + 2 + 3: metric with icon tile, trend and optional sparkline. */
export function KpiCard({
  label,
  value,
  delta,
  caption,
  icon,
  spark,
  toneClass,
}: {
  label: string;
  value: string;
  delta: number;
  caption: string;
  icon: string;
  spark?: number[];
  toneClass?: string;
}) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[icon] ?? Icons.Activity;
  return (
    <div className="vexui-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{value}</p>
        </div>
        <span className={cn("icon-tile", toneClass)}>
          <Cmp className="size-[18px]" aria-hidden />
        </span>
      </div>
      {spark && (
        <div className="-mx-1 mt-3">
          <ApexChart
            type="area"
            height={48}
            options={sparklineOptions(token("--primary"))}
            series={[{ name: label, data: spark }]}
          />
        </div>
      )}
      <div className="mt-3">
        <Delta value={delta} caption={caption} />
      </div>
    </div>
  );
}

/** KPI style 4: metric with target progress. */
export function TargetCard({
  label,
  value,
  target,
  progress,
}: {
  label: string;
  value: string;
  target: string;
  progress: number;
}) {
  return (
    <div className="vexui-card p-5">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-[26px] font-semibold leading-none tracking-tight">{value}</p>
        <span className="text-[12.5px] text-muted-foreground">of {target}</span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-[12.5px] text-muted-foreground">{progress}% of quarterly target</p>
    </div>
  );
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <img
      src={getUserImage(initials)}
      alt={`${initials} profile`}
      className={cn("size-9 shrink-0 rounded-full object-cover", className)}
    />
  );
}
