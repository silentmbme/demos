import { useEffect, useState } from "react";

import {
  Bell,
  Boxes,
  CircleDotDashed,
  Compass,
  Home,
  RefreshCw,
  Route as RouteIcon,
  ServerCrash,
  Wrench,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/branding/BrandLogo";

/* =====================================================
   Types
===================================================== */

type ErrorId = "404" | "500" | "503" | "maintenance";

/* =====================================================
   Global Config
===================================================== */

const config = {
  brandName: "Vexui",
  dashboardRoute: "/",
  supportUrl: "/pages/faq",
  statusUrl: undefined as string | undefined,
};

/* =====================================================
   Error Page Content
===================================================== */

const pages: Record<
  ErrorId,
  {
    title: string;
    eyebrow: string;
    description: string;
    documentTitle: string;
  }
> = {
  "404": {
    eyebrow: "NAVIGATION ERROR",
    title: "Looks like you're off route",
    description:
      "The page you're looking for may have been moved, deleted, or the address could be incorrect.",
    documentTitle: "404  Page Not Found",
  },

  "500": {
    eyebrow: "SERVER ERROR",
    title: "Something went wrong",
    description: "An unexpected server error occurred while processing your request.",
    documentTitle: "500  Server Error",
  },

  "503": {
    eyebrow: "SERVICE STATUS",
    title: "Service temporarily unavailable",
    description: "We're currently unable to complete your request. Please try again shortly.",
    documentTitle: "503  Service Unavailable",
  },

  maintenance: {
    eyebrow: "SCHEDULED MAINTENANCE",
    title: "We're making things better",
    description:
      "We're performing scheduled maintenance to improve performance, reliability and overall experience.",
    documentTitle: "Maintenance",
  },
};

const errorIds: ErrorId[] = ["404", "500", "503", "maintenance"];

/* =====================================================
   Shared Error Shell
===================================================== */

function ErrorShell({ id, children }: { id: ErrorId; children: React.ReactNode }) {
  const item = pages[id];

  useEffect(() => {
    document.title = `${item.documentTitle} | ${config.brandName}`;
  }, [item.documentTitle]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 py-6 text-foreground sm:px-10 sm:py-8">
      {/* Background Grid */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[.45]
          [background-image:linear-gradient(hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.45)_1px,transparent_1px)]
          [background-size:44px_44px]
        "
      />

      {/* Background Glow */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          -start-44
          top-1/3
          size-[34rem]
          rounded-full
          bg-primary/10
          blur-3xl
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          -end-44
          -top-40
          size-[32rem]
          rounded-full
          bg-primary/10
          blur-3xl
        "
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        {/* Header */}

        <header className="flex items-center justify-between gap-4">
          <a
            href={config.dashboardRoute}
            className="flex items-center gap-2.5 text-base font-semibold tracking-tight"
          >
            <BrandLogo className="h-9 w-[112px]" />
          </a>

          {/* Error Page Switcher */}

          <div className="hidden rounded-full border border-border bg-card/90 p-1 shadow-sm sm:flex">
            {errorIds.map((errorId) => (
              <a
                key={errorId}
                href={`/auth/errors/${errorId}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",

                  id === errorId
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {errorId === "maintenance" ? "Maintenance" : errorId}
              </a>
            ))}
          </div>
        </header>

        {children}

        {/* Footer */}

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground">
          <span>2026 {config.brandName}</span>

          <div className="flex gap-4">
            <a href={config.supportUrl} className="hover:text-primary">
              Help Center
            </a>

            {config.statusUrl && (
              <a href={config.statusUrl} className="hover:text-primary">
                Status
              </a>
            )}

            <a href="/" className="hover:text-primary">
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* =====================================================
   404 Route Visual
===================================================== */

function RouteVisual() {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-[0_30px_70px_-42px_rgba(57,48,157,.55)]">
      {/* Grid Background */}

      <div
        className="
          absolute
          inset-0
          opacity-70
          [background-image:linear-gradient(hsl(var(--primary)/.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/.1)_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

      {/* Route Lines */}

      <div className="absolute start-[16%] top-[22%] h-px w-[56%] rotate-[28deg] bg-primary/50" />

      <div className="absolute start-[35%] top-[50%] h-px w-[48%] -rotate-[31deg] bg-primary/50" />

      <div className="absolute start-[12%] top-[72%] h-px w-[42%] -rotate-[14deg] bg-primary/50" />

      {/* Route Nodes */}

      {[
        ["start-[14%] top-[18%]", "bg-primary"],
        ["start-[64%] top-[35%]", "bg-emerald-500"],
        ["start-[43%] top-[70%]", "bg-amber-500"],
        ["end-[12%] bottom-[17%]", "bg-primary"],
      ].map(([position, color], index) => (
        <span
          key={index}
          className={cn(
            "absolute grid size-9 place-items-center rounded-xl border-4 border-card shadow-lg",
            position,
            color,
          )}
        >
          <span className="size-2 rounded-full bg-white" />
        </span>
      ))}

      {/* Center Lost Route */}

      <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.75rem] border border-primary/20 bg-background/90 shadow-xl backdrop-blur">
        <Compass className="size-10 text-primary" />

        <span className="absolute -bottom-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground">
          LOST ROUTE
        </span>
      </div>

      {/* Route Info */}

      <div className="absolute bottom-6 start-6 rounded-2xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur">
        <RouteIcon className="size-5 text-primary" />

        <p className="mt-2 text-xs font-semibold">Route map</p>

        <p className="text-[11px] text-muted-foreground">Destination unavailable</p>
      </div>

      {/* Current Path */}

      <div className="absolute end-6 top-6 rounded-2xl border border-border bg-background/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <span className="text-muted-foreground">Path</span>

        <p className="mt-1 font-mono text-[11px] text-primary">/unknown-location</p>
      </div>
    </div>
  );
}

/* =====================================================
   System Status Visual
===================================================== */

function SystemVisual({ type }: { type: "failure" | "service" | "maintenance" }) {
  const accent =
    type === "maintenance"
      ? "text-amber-600"
      : type === "service"
        ? "text-emerald-600"
        : "text-primary";

  const Icon = type === "maintenance" ? Wrench : type === "service" ? CircleDotDashed : ServerCrash;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div
        aria-hidden
        className="absolute -end-10 -top-10 size-40 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="relative grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((cell) => (
          <div
            key={cell}
            className={cn(
              "h-16 rounded-2xl border border-border bg-muted/35 p-3",

              cell === 4 && "border-primary/25 bg-primary/10",
            )}
          >
            <span className="block size-2 rounded-full bg-current opacity-70" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto -mt-11 grid size-20 place-items-center rounded-3xl border-4 border-card bg-background shadow-xl">
        <Icon className={cn("size-9", accent)} />
      </div>

      <p className="relative mt-5 text-center text-sm font-semibold">
        {type === "failure"
          ? "Application API diagnostic"
          : type === "service"
            ? "Service health monitor"
            : "Maintenance workflow"}
      </p>
    </div>
  );
}

/* =====================================================
   404 Page
===================================================== */

function Error404() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-8">
      {/* Background */}

      <div
        aria-hidden
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_48%,hsl(var(--primary)/.11),transparent_26rem)]
        "
      />

      <div
        aria-hidden
        className="
          absolute
          inset-0
          opacity-40
          [background-image:linear-gradient(hsl(var(--border)/.35)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.35)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      {/* Logo */}

      <a
        href={config.dashboardRoute}
        className="sm:absolute mb-4 start-5 top-6 flex items-center gap-2.5 text-base font-semibold tracking-tight sm:start-10 sm:top-8"
      >
        <BrandLogo className="h-9 w-[112px]" />
      </a>

      {/* Content */}

      <section className="relative w-full max-w-2xl text-center">
        <p className="text-[clamp(8rem,25vw,14rem)] font-black leading-none tracking-[-.02em] text-primary drop-shadow-[0_18px_25px_hsl(var(--primary)/.16)]">
          404
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="my-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={config.dashboardRoute}
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "shadow-xl shadow-primary/25",
            )}
          >
            <Home className="me-2 size-4" />
            Back to dashboard
          </a>

          <a
            href="mailto:support@vexuiadmin.demo"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
            })}
          >
            Contact support
          </a>
        </div>
      </section>

      <ErrorFooter />
    </main>
  );
}

/* =====================================================
   Shared Error Footer
===================================================== */

function ErrorFooter() {
  return (
    <footer className="absolute bottom-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:bottom-8">
      <a href={config.supportUrl} className="hover:text-primary">
        Help Center
      </a>

      <span>2026 {config.brandName}</span>

      <a href="/" className="hover:text-primary">
        Privacy
      </a>
    </footer>
  );
}

/* =====================================================
   500 Page
===================================================== */

function Error500() {
  const [details, setDetails] = useState(false);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,hsl(var(--primary)/.1),transparent_26rem)]"
      />

      <a
        href={config.dashboardRoute}
        className="sm:absolute mb-4 start-5 top-6 flex items-center gap-2.5 text-base font-semibold tracking-tight sm:start-10 sm:top-8"
      >
        <BrandLogo className="h-9 w-[112px]" />
      </a>

      <section className="relative w-full max-w-2xl text-center">
        <p className="text-xs font-bold tracking-[.18em] text-primary">SERVER ERROR</p>

        <p className="mt-5 text-[clamp(8rem,25vw,14rem)] font-black leading-none tracking-[-.02em] text-primary drop-shadow-[0_18px_25px_hsl(var(--primary)/.16)]">
          500
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          An unexpected server error occurred while processing your request. Our team has been
          notified.
        </p>

        <div className="my-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="shadow-xl shadow-primary/25"
          >
            <RefreshCw className="me-2 size-4" />
            Try again
          </Button>

          <a
            href={config.dashboardRoute}
            className={buttonVariants({
              size: "lg",
              variant: "outline",
            })}
          >
            <Home className="me-2 size-4" />
            Back to dashboard
          </a>
        </div>

        {/* Diagnostic */}
      </section>

      <ErrorFooter />
    </main>
  );
}

/* =====================================================
   503 Page
===================================================== */

function Error503() {
  const services = [
    ["Web App", "Operational"],
    ["API", "Degraded"],
    ["Database", "Operational"],
    ["File Service", "Operational"],
    ["Background Jobs", "Operational"],
  ];

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,hsl(var(--primary)/.1),transparent_26rem)]"
      />

      <a
        href={config.dashboardRoute}
        className="sm:absolute mb-4 start-5 top-6 flex items-center gap-2.5 text-base font-semibold tracking-tight sm:start-10 sm:top-8"
      >
        <BrandLogo className="h-9 w-[112px]" />
      </a>

      <section className="relative w-full max-w-2xl text-center">
        <p className="text-xs font-bold tracking-[.18em] text-primary">SERVICE STATUS</p>

        <p className="mt-5 text-[clamp(8rem,25vw,14rem)] font-black leading-none tracking-[-.02em] text-primary drop-shadow-[0_18px_25px_hsl(var(--primary)/.16)]">
          503
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Service temporarily unavailable
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          We're currently unable to complete your request. Please try again shortly.
        </p>

        <div className="my-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="shadow-xl shadow-primary/25"
          >
            <RefreshCw className="me-2 size-4" />
            Try again
          </Button>

          <a
            href={config.supportUrl}
            className={buttonVariants({
              size: "lg",
              variant: "outline",
            })}
          >
            Contact support
          </a>
        </div>

        {/* Services */}
      </section>

      <ErrorFooter />
    </main>
  );
}

/* =====================================================
   Maintenance Page
===================================================== */

function MaintenancePage() {
  const [email, setEmail] = useState("");

  const [remaining, setRemaining] = useState(() => 2 * 86400 + 14 * 3600 + 37 * 60 + 9);

  /* ---------------------------------------------------
     Countdown Timer
  --------------------------------------------------- */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /* ---------------------------------------------------
     Notification Form
  --------------------------------------------------- */

  const notify = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address");

      return;
    }

    toast.success("Notification preference saved for this demo.");

    setEmail("");
  };

  /* ---------------------------------------------------
     Countdown Calculations
  --------------------------------------------------- */

  const days = Math.floor(remaining / 86400);

  const hours = Math.floor((remaining % 86400) / 3600);

  const minutes = Math.floor((remaining % 3600) / 60);

  const seconds = remaining % 60;

  const clock = [
    [days, "Days"],
    [hours, "Hours"],
    [minutes, "Mins"],
    [seconds, "Secs"],
  ];

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-8">
      {/* Background */}

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,hsl(var(--primary)/.12),transparent_28rem)]"
      />

      <div
        aria-hidden
        className="
          absolute
          inset-0
          opacity-35
          [background-image:linear-gradient(hsl(var(--border)/.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.3)_1px,transparent_1px)]
          [background-size:52px_52px]
        "
      />

      {/* Logo */}

      <a
        href={config.dashboardRoute}
        className="sm:absolute mb-4 start-5 top-6 flex items-center gap-2.5 text-base font-semibold tracking-tight sm:start-10 sm:top-8"
      >
        <BrandLogo className="h-9 w-[112px]" />
      </a>

      {/* Content */}

      <section className="relative w-full max-w-3xl text-center">
        <span className="mx-auto grid size-24 place-items-center rounded-[1.7rem] bg-amber-500/10 text-amber-600 shadow-sm">
          <Wrench className="size-10" />
        </span>

        <p className="mt-8 text-xs font-bold tracking-[.18em] text-primary">
          SCHEDULED MAINTENANCE
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Under maintenance
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          We're upgrading for a better experience. We'll be back shortly.
        </p>

        {/* Countdown */}

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {clock.map(([value, label]) => (
            <div
              key={String(label)}
              className="
                  rounded-2xl
                  border
                  border-border
                  bg-card/90
                  px-3
                  py-6
                  shadow-sm
                "
            >
              <p className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
                {String(value).padStart(2, "0")}
              </p>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Notify Form */}

        <form
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();

            notify();
          }}
        >
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Notify me when back..."
            aria-label="Email address"
            className="
              h-14
              min-w-0 sm:py-0 py-4
              flex-1
              rounded-2xl
              border
              border-border
              bg-card
              px-5
              text-base
              outline-none
              transition
              focus:ring-2
              focus:ring-primary/30
            "
          />

          <Button type="submit" size="lg" className="h-14 shadow-xl shadow-primary/25">
            <Bell className="me-2 size-4" />
            Notify me
          </Button>
        </form>

        <p className="mt-3 mb-12 text-xs text-muted-foreground">
          Demo notification preference no email will be sent.
        </p>
      </section>

      <ErrorFooter />
    </main>
  );
}

/* =====================================================
   Error Router Component
===================================================== */

export function ErrorPage({ id }: { id: ErrorId | string }) {
  const safeId: ErrorId = errorIds.includes(id as ErrorId) ? (id as ErrorId) : "404";

  if (safeId === "500") {
    return <Error500 />;
  }

  if (safeId === "503") {
    return <Error503 />;
  }

  if (safeId === "maintenance") {
    return <MaintenancePage />;
  }

  return <Error404 />;
}

/* =====================================================
   Individual Page Exports
===================================================== */

export function Error404Page() {
  return <Error404 />;
}

export function Error500Page() {
  return <Error500 />;
}

export function Error503Page() {
  return <Error503 />;
}

export function MaintenanceSystemPage() {
  return <MaintenancePage />;
}

/* =====================================================
   Error Pages Index
===================================================== */

export function ErrorIndex() {
  return (
    <ErrorShell id="404">
      <div className="my-auto flex-1 py-14">
        <p className="text-xs font-bold tracking-[.18em] text-primary">SYSTEM PAGES</p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Error & maintenance</h1>

        <p className="mt-3 max-w-xl text-muted-foreground">
          Four intentional recovery experiences for Vexui.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {errorIds.map((id) => (
            <Link
              key={id}
              to="/auth/errors/$error"
              params={{
                error: id,
              }}
              className="
                rounded-3xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-primary/30
                hover:shadow-lg
              "
            >
              {/* Icon */}

              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                {id === "404" ? (
                  <Compass className="size-5" />
                ) : id === "500" ? (
                  <ServerCrash className="size-5" />
                ) : id === "503" ? (
                  <Boxes className="size-5" />
                ) : (
                  <Wrench className="size-5" />
                )}
              </span>

              {/* Error Code */}

              <p className="mt-6 text-3xl font-black tracking-tight text-primary/35">
                {id === "maintenance" ? "UP" : id}
              </p>

              {/* Title */}

              <p className="mt-3 font-semibold">{pages[id].title}</p>

              {/* Description */}

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {pages[id].description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </ErrorShell>
  );
}
