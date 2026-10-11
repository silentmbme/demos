import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Layers3,
  Mail,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/branding/BrandLogo";

import { isDark, setSettings, useVexuiSettings } from "@/lib/vexui-settings";

/* =====================================================
   Types
===================================================== */

type Flow =
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "reset-password"
  | "verify-email"
  | "two-step"
  | "lock-screen";

type Variant = "basic" | "cover";

const basicAuthShellClass =
  "mx-auto flex min-h-[calc(100vh-2rem)] max-w-lg overflow-hidden rounded-3xl border bg-card shadow-xl sm:min-h-[calc(100vh-3rem)]";
const coverAuthShellClass =
  "mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-xl sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_.95fr]";
const basicAuthPanelClass = "flex min-w-0 flex-1 flex-col p-6 sm:p-9";
const coverAuthPanelClass = "flex min-w-0 flex-col p-6 sm:p-9 lg:p-11";

/* =====================================================
   Authentication Page Text
===================================================== */

const flowCopy: Record<Flow, [string, string]> = {
  "sign-in": ["Welcome back", "Sign in to continue to your workspace."],

  "sign-up": ["Create your account", "Start organizing your work in one place."],

  "forgot-password": [
    "Forgot your password?",
    "Enter your email and we'll send reset instructions.",
  ],

  "reset-password": ["Create a new password", "Choose a strong password for your account."],

  "verify-email": ["Verify your email", "We sent a verification link to sophia@example.com."],

  "two-step": ["Confirm it's you", "Enter the 6-digit code sent to   1234."],

  "lock-screen": [
    "Welcome back, Sophia",
    "Your session is locked. Enter your password to continue.",
  ],
};

const forgotPasswordCopyByVariant: Record<Variant, [string, string]> = {
  basic: ["Forgot your password?", "Enter your email and we'll send reset instructions."],
  cover: ["Forgot your password?", "Enter your email and we'll send reset instructions."],
};
/* =====================================================
   Brand
===================================================== */

function Brand() {
  return (
    <Link href="/" aria-label="Vexui home">
      <BrandLogo className="h-8 w-[112px]" />
    </Link>
  );
}

/* =====================================================
   Footer
===================================================== */

function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-4 text-xs text-muted-foreground">
      <a href="#privacy" className="hover:text-foreground">
        Privacy
      </a>

      <a href="#terms" className="hover:text-foreground">
        Terms
      </a>

      <a href="#help" className="hover:text-foreground">
        Help
      </a>
    </footer>
  );
}

/* =====================================================
   Theme Toggle
===================================================== */

function ThemeToggle() {
  const settings = useVexuiSettings();

  const dark = isDark(settings);

  const handleThemeChange = () => {
    setSettings({
      mode: dark ? "light" : "dark",
    });
  };

  return (
    <button
      type="button"
      onClick={handleThemeChange}
      className="
        rounded-lg
        border
        border-border
        p-2
        text-muted-foreground
        hover:bg-muted
        hover:text-foreground
      "
      aria-label="Toggle color theme"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

/* =====================================================
   Normal Input Field
===================================================== */

interface FieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
}

function Field({ label, error, ...props }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>

      <Input
        {...props}
        className={cn(
          props.className,

          error && "border-destructive focus-visible:ring-destructive",
        )}
      />

      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

/* =====================================================
   Password Field
===================================================== */

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
}

function PasswordField({
  label = "Password",
  value,
  onChange,
  autoComplete = "current-password",
  error,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>

      <span className="relative block">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className={cn(
            "pe-10",

            error && "border-destructive",
          )}
        />

        {/* Show / Hide Password */}

        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          className="
            absolute
            end-2
            top-1/2
            -translate-y-1/2
            p-1
            text-muted-foreground
            hover:text-foreground
          "
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>

      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

/* =====================================================
   Password Strength
===================================================== */

function Strength({ value }: { value: string }) {
  const score =
    value.length > 11 ? 4 : value.length > 8 ? 3 : value.length > 5 ? 2 : value.length ? 1 : 0;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  const label = labels[score];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Password strength</span>

        <span className={score > 2 ? "text-emerald-600" : ""}>{label || "Add a password"}</span>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={cn(
              "h-1.5 rounded-full bg-muted",

              item <= score && (score > 2 ? "bg-emerald-500" : "bg-primary"),
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   Success Message
===================================================== */

interface SuccessProps {
  title: string;
  body: string;
  action?: React.ReactNode;
}

function Success({ title, body, action }: SuccessProps) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
        <CheckCircle2 className="size-7" />
      </span>

      <h2 className="mt-5 text-xl font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{body}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* =====================================================
   OTP Input
===================================================== */

function Otp({ onComplete }: { onComplete: () => void }) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  /* ---------------------------------------------------
     Update Individual OTP
  --------------------------------------------------- */

  const setOtpValue = (index: number, value: string) => {
    // Remove non-numeric characters
    const digit = value.replace(/\D/g, "").slice(-1);

    const next = [...values];

    next[index] = digit;

    setValues(next);

    // Automatically move to next input
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }

    // All 6 numbers entered
    if (next.every(Boolean)) {
      onComplete();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {values.map((value, index) => (
        <Input
          key={index}

          ref={(element) => {
            refs.current[index] = element;
          }}

          value={value}

          onChange={(event) => setOtpValue(index, event.target.value)}

          onKeyDown={(event) => {
            if (event.key === "Backspace" && !values[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}

          onPaste={(event) => {
            const chars = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 6)
              .split("");

            if (chars.length) {
              event.preventDefault();

              const nextValues = chars.concat(Array(6).fill("")).slice(0, 6);

              setValues(nextValues);

              refs.current[Math.min(chars.length, 5)]?.focus();
            }
          }}

          inputMode="numeric"

          aria-label={`Verification digit ${index + 1}`}

          className="
            h-12
            min-w-0
            px-0
            text-center
            text-lg
            font-semibold
          "
        />
      ))}
    </div>
  );
}

/* =====================================================
   Main Authentication Content
===================================================== */

function AuthContent({ flow, variant }: { flow: Flow; variant: Variant }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [countdown, setCountdown] = useState(32);

  /* =====================================================
     Verification Countdown
  ===================================================== */

  useEffect(() => {
    const requiresCountdown = flow === "verify-email" || flow === "two-step";

    if (!requiresCountdown || countdown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [flow, countdown]);

  /* =====================================================
     Form Submit
  ===================================================== */

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    /* Email Validation */

    const requiresEmail = ["sign-in", "sign-up", "forgot-password"].includes(flow);

    if (requiresEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    /* Password Required */

    const requiresPassword = ["sign-in", "sign-up", "reset-password", "lock-screen"].includes(flow);

    if (requiresPassword && !password) {
      nextErrors.password = "Password is required.";
    }

    /* Minimum Password Length */

    const requiresStrongPassword = ["sign-up", "reset-password"].includes(flow);

    if (requiresStrongPassword && password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    /* Confirm Password */

    if (requiresStrongPassword && password !== confirm) {
      nextErrors.confirm = "Passwords do not match.";
    }

    setErrors(nextErrors);

    /* Stop if validation failed */

    if (Object.keys(nextErrors).length) {
      return;
    }

    /* Loading */

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (["forgot-password", "reset-password"].includes(flow)) {
        setSuccess(true);
      }
    }, 650);
  };

  /* =====================================================
     Success Screen
  ===================================================== */

  if (success) {
    return (
      <Success
        title={flow === "forgot-password" ? "Check your email" : "Password updated successfully"}
        body={
          flow === "forgot-password"
            ? "Reset instructions have been sent to your email address."
            : "Your password has been reset. You can now sign in."
        }
        action={
          <Button asChild>
            <Link href="/auth/sign-in/basic">Return to Sign In</Link>
          </Button>
        }
      />
    );
  }

  /* =====================================================
     Verify Email
  ===================================================== */

  if (flow === "verify-email") {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-7" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold">Verify your email</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We sent a verification link to{" "}
            <strong className="text-foreground">sophia@example.com</strong>.
          </p>
        </div>

        <Button className="w-full" onClick={() => setSuccess(true)}>
          Ive verified my email
        </Button>

        <button
          className="
            w-full
            text-sm
            font-medium
            text-primary
            disabled:text-muted-foreground
          "
          disabled={countdown > 0}
          onClick={() => setCountdown(32)}
        >
          {countdown ? `Resend email in ${countdown}s` : "Resend verification email"}
        </button>

        <Link
          className="block text-sm text-muted-foreground hover:text-primary"
          href="/auth/sign-in/basic"
        >
          Return to Sign In
        </Link>
      </div>
    );
  }

  /* =====================================================
     Two Step Verification
  ===================================================== */

  if (flow === "two-step") {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </span>

          <h1 className="mt-4 text-2xl font-semibold">Confirm its you</h1>

          <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to 1234.</p>
        </div>

        <Otp onComplete={() => setSuccess(true)} />

        <p className="text-center text-xs text-muted-foreground">
          {countdown ? (
            `You can request a new code in ${countdown}s`
          ) : (
            <button className="font-medium text-primary" onClick={() => setCountdown(32)}>
              Resend code
            </button>
          )}
        </p>
      </div>
    );
  }

  /* =====================================================
     Normal Authentication Forms
  ===================================================== */

  const [title, description] =
    flow === "forgot-password" ? forgotPasswordCopyByVariant[variant] : flowCopy[flow];

  const buttons = {
    "sign-in": "Sign In",
    "sign-up": "Create Account",
    "forgot-password": "Send Reset Link",
    "reset-password": "Reset Password",
    "lock-screen": "Unlock",
  };

  const button = buttons[flow as keyof typeof buttons] ?? "Continue";

  if (flow === "forgot-password" && variant === "cover") {
    return (
      <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-6">
        <div>
          {flow === "lock-screen" && (
            <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-6" />
            </span>
          )}

          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <Field
          label="Work email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending reset link..." : "Send recovery link"}
        </Button>
        <Link
          href="/auth/sign-in/cover"
          className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <span aria-hidden="true">&larr;</span>Back to sign in
        </Link>
      </form>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Heading */}

      <div>
        {flow === "lock-screen" && (
          <span className="mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" />
          </span>
        )}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {/* Name Fields */}

      {flow === "sign-up" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" placeholder="Sophia" autoComplete="given-name" />

          <Field label="Last name" placeholder="Carter" autoComplete="family-name" />
        </div>
      )}

      {/* Email */}

      {["sign-in", "sign-up", "forgot-password"].includes(flow) && (
        <Field
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />
      )}

      {/* Password */}

      {["sign-in", "sign-up", "reset-password", "lock-screen"].includes(flow) && (
        <PasswordField
          label={flow === "reset-password" ? "New password" : "Password"}
          value={password}
          onChange={setPassword}
          autoComplete={
            flow === "sign-up" || flow === "reset-password" ? "new-password" : "current-password"
          }
          error={errors.password}
        />
      )}

      {/* Password Strength + Confirm */}

      {["sign-up", "reset-password"].includes(flow) && (
        <>
          <Strength value={password} />

          <PasswordField
            label="Confirm password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            error={errors.confirm}
          />
        </>
      )}

      {/* Remember Me */}

      {flow === "sign-in" && (
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox />
            Remember me
          </label>

          <Link
            href="/auth/forgot-password/basic"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}

      {/* Terms */}

      {flow === "sign-up" && (
        <label className="flex items-start gap-2 text-sm leading-5 text-muted-foreground">
          <Checkbox className="mt-0.5" />

          <span>
            I agree to the{" "}
            <a href="#terms" className="text-primary">
              Terms
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-primary">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      )}

      {/* Submit */}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? `${button.replace("Link", "")}` : button}
      </Button>

      {/* Social Login */}

      {flow === "sign-in" && (
        <>
          <div className="relative py-1.5 text-center text-xs text-muted-foreground">
            <span className="absolute inset-x-0 top-1/2 border-t border-border" />

            <span className="relative bg-card px-3">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => window.alert("Google sign-in is a demo action.")}
            >
              <Chrome className="size-4" />
              Google
            </Button>

            <Button
              type="button"
              className="
                gap-2
                bg-[#24292f]
                text-white
                hover:bg-[#1b1f23]
                dark:bg-white
                dark:text-slate-900
                dark:hover:bg-slate-200
              "
              onClick={() => window.alert("GitHub sign-in is a demo action.")}
            >
              <Github className="size-4" />
              GitHub
            </Button>
          </div>

          <div className="space-y-2 text-center text-sm">
            <Link
              href="/auth/lock-screen/basic"
              className="block font-medium text-muted-foreground hover:text-primary"
            >
              Lock screen demo
            </Link>

            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/sign-up/basic" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </>
      )}

      {/* Sign Up  Sign In */}

      {flow === "sign-up" && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in/basic" className="font-medium text-primary">
            Sign In
          </Link>
        </p>
      )}

      {/* Lock Screen */}

      {flow === "lock-screen" && (
        <Link
          href="/auth/sign-in/basic"
          className="block text-center text-sm font-medium text-primary"
        >
          Switch account
        </Link>
      )}
    </form>
  );
}
/* =====================================================
   Public Authentication Page
===================================================== */

export function AuthFlowApp({ flow, variant = "basic" }: { flow: Flow; variant?: Variant }) {
  const isCover = variant === "cover";

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className={isCover ? coverAuthShellClass : basicAuthShellClass}>
        <section className={isCover ? coverAuthPanelClass : basicAuthPanelClass}>
          <header className="flex items-center justify-between gap-4">
            <Brand />
            <ThemeToggle />
          </header>
          <div className="py-10">
            <AuthContent flow={flow} variant={variant} />
          </div>
          <Footer />
        </section>

        {isCover && (
          <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -end-24 -top-24 size-80 rounded-full border-[36px] border-white/10" />
            <div className="absolute -bottom-32 -start-20 size-96 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Vexui
              </p>
              <h1 className="mt-5 max-w-sm text-4xl text-white font-semibold leading-tight">
                A calmer way to run your work.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                Bring teams, projects, customer relationships, and daily decisions into one focused
                workspace.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium">
                It gives our whole team a much clearer view of what needs attention.
              </p>
              <p className="mt-4 text-xs text-white/70">Sofia Carter Operations Lead</p>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
