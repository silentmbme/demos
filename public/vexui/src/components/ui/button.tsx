import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--transition-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)] hover:-translate-y-px active:translate-y-0 active:bg-[var(--primary-active)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:bg-destructive/90 hover:-translate-y-px active:translate-y-0",
        outline:
          "border border-input bg-background shadow-[var(--shadow-xs)] hover:border-[var(--accent-border)] hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-xs)] hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary/12 text-primary hover:bg-primary/18",
        gradient:
          "bg-gradient-to-r from-primary to-primary/75 text-primary-foreground shadow-sm hover:brightness-105",
        success: "bg-success text-white shadow-sm hover:brightness-95",
        warning: "bg-warning text-white shadow-sm hover:brightness-95",
        info: "bg-info text-white shadow-sm hover:brightness-95",
        dark: "bg-foreground text-background shadow-sm hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        iconSm: "h-8 w-8",
        iconLg: "h-10 w-10",
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pill: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      pill,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            pill,
            className,
          }),
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {!asChild && loading && <LoaderCircle className="animate-spin" />}

        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
