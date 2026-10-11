import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";

import appCss from "../styles.css?url";
import { themeBootstrapScript, useVexuiSettings } from "../lib/vexui-settings";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vexui – React 19 Tailwind CSS Admin Dashboard Template" },
      {
        name: "description",
        content:
          "Vexui is a modern React 19, TypeScript and Tailwind CSS v4 admin dashboard template for SaaS, eCommerce, CRM, analytics and business applications. Explore responsive layouts, reusable components and dark/light themes.",
      },
      {
        name: "keywords",
        content:
          "react admin dashboard, react dashboard template, react admin template, tailwind css admin dashboard, tailwind dashboard template, react 19 admin template, typescript admin dashboard, vite admin template, saas dashboard, ecommerce dashboard, crm dashboard, analytics dashboard, responsive admin template, dark mode dashboard, admin panel template",
      },
      { name: "author", content: "SM Pixel Crafts" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Vexui – React 19 Tailwind CSS Admin Dashboard Template" },
      {
        property: "og:description",
        content:
          "Vexui is a modern React 19, TypeScript and Tailwind CSS v4 admin dashboard template for SaaS, eCommerce, CRM, analytics and business applications. Explore responsive layouts, reusable components and dark/light themes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Vexui" },
      { property: "og:image", content: "/favicon.png" },
      { property: "og:image:alt", content: "Vexui Premium Admin Dashboard" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vexui – React 19 Tailwind CSS Admin Dashboard Template" },
      {
        name: "twitter:description",
        content:
          "Vexui is a modern React 19, TypeScript and Tailwind CSS v4 admin dashboard template for SaaS, eCommerce, CRM, analytics and business applications. Explore responsive layouts, reusable components and dark/light themes.",
      },
      { name: "twitter:image", content: "/favicon.png" },
      { name: "twitter:image:alt", content: "Vexui Premium Admin Dashboard" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const settings = useVexuiSettings();
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={settings.direction}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </DirectionProvider>
    </QueryClientProvider>
  );
}
