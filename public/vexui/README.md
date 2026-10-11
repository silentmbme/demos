# Vexui

Vexui is a responsive React 19 admin dashboard template for SaaS, eCommerce, CRM, analytics, finance, project, and business workflows. It includes reusable UI components, application pages, charts, forms, tables, authentication flows, and a live appearance customizer.

## Product overview

Vexui is built for product teams that need a consistent operational workspace without starting from an empty application shell. The source is TypeScript-first and uses TanStack file-based routing, Tailwind CSS v4, and ApexCharts.

## Features

- Eight dashboard views: Executive, Analytics, eCommerce, CRM, Projects, Finance, Marketing, and SaaS
- Built-in Email, Chat, Calendar, Tasks, Kanban, and File Manager applications
- eCommerce, CRM, projects, invoices, profile, settings, pricing, and FAQ pages
- Reusable UI element, form, table, and chart galleries
- Authentication, email template, and error-page flows
- Responsive application shell with sidebar, header, and mobile navigation
- Light, dark, and system appearance modes with runtime skin, sidebar, and layout preferences
- Local logo and user-image assets

## Tech stack

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite 8
- Tailwind CSS v4
- Radix UI primitives
- ApexCharts and react-apexcharts
- lucide-react

## Requirements

Use a current Node.js LTS release and npm. The package lock file is included for reproducible installation.

## Installation

```bash
npm install
npm run dev
```

The development server is provided by Vite. Open the local URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `.output/` and is excluded from source distribution.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run format
```

## Folder structure

```text
src/
  assets/        Local logo and user image assets
  components/    Reusable UI, layout, dashboard, chart, auth, and page components
  data/          Navigation and demo data
  hooks/         Shared React hooks
  lib/           Settings, chart, utility, and error-reporting helpers
  routes/        TanStack file-based routes
  styles.css     Global design tokens and application styles
public/          Favicon, robots.txt, and social-preview assets
documentation/   Standalone customer documentation
landing/         Standalone product landing page
```

## Routing

Vexui uses TanStack file-based routes. Add route files under `src/routes/`. For example, `src/routes/reports.tsx` maps to `/reports`. Use `createFileRoute` and keep route components focused on page composition.

## Layout system

`AppShell` provides the shared sidebar, header, page canvas, and customizer. Dashboard and workspace pages render inside this shell. Standalone authentication and system pages intentionally use their own layouts.

## Tailwind and theme customization

Global styles and design tokens are defined in `src/styles.css`. Runtime preferences are managed by `src/lib/nova-settings.ts`, including light/dark/system mode, accent skin, sidebar appearance, header behavior, and fluid/boxed content width. Use existing semantic classes and tokens instead of adding hard-coded colors to feature components.

## Adding a page and menu item

1. Create a typed route in `src/routes/`.
2. Compose the page from existing layout and UI components where possible.
3. Add the destination to `src/data/navigation.ts` if it belongs in the sidebar.
4. Run `npm run lint` and `npm run build` before shipping the change.

## Reusable components

- `src/components/ui/` contains primitive controls and Radix-backed components.
- `src/components/charts/ApexChart.tsx` is the SSR-safe chart wrapper.
- `src/components/dashboard/` contains dashboard composition and shared widgets.
- `src/components/layout/` contains the application shell, header, sidebar, and customizer.

## Icons, charts, tables, and forms

Icons are supplied by `lucide-react`. Charts use ApexCharts through the shared wrapper. Table, chart, form, and UI showcase routes demonstrate component usage and can be used as implementation references.

## Assets

Brand assets live in `src/assets/images/logos/`; user images live in `src/assets/images/users/`. The social-preview image used by route metadata is `public/images/vexui-preview.png`. Keep new distributed assets local and document any third-party asset license before including it.

## Troubleshooting

- Delete generated build output and run `npm install` if dependencies become inconsistent.
- Verify the Node.js version is current LTS.
- Run `npm run lint` for source diagnostics.
- Run `npm run build` to validate all route imports and production output.

## Browser support

Vexui supports current evergreen versions of Chrome, Edge, Firefox, and Safari. Test custom browser-specific behavior before customer delivery.

## Support

See `documentation/support.html` for customer support guidance. Include reproduction steps, browser version, route, and screenshots when reporting an issue.

## Credits and licenses

Vexui is authored by **SM Pixel Craft**. Third-party dependencies remain under their respective licenses. See `documentation/dependencies.html` and `LICENSE-INFO.txt` for distribution notes. Customer use is governed by the marketplace license.
