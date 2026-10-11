export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: { text: string; tone?: "primary" | "success" | "warning" };
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Icon names map to lucide-react exports (see icon-map.ts).
 */
export const NAVIGATION: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboards",
        href: "/",
        icon: "LayoutDashboard",
        badge: { text: "16", tone: "primary" },
        children: [
          { label: "Executive", href: "/" },
          { label: "Analytics", href: "/dashboards/analytics" },
          { label: "eCommerce", href: "/dashboards/ecommerce" },
          { label: "AI Analytics", href: "/dashboards/ai-analytics" },
          { label: "Crypto", href: "/dashboards/crypto" },
          { label: "Hospital Management", href: "/dashboards/hospital-management" },
          { label: "LMS", href: "/dashboards/lms-dashboard" },
          { label: "CRM", href: "/dashboards/crm" },
          { label: "Logistics", href: "/dashboards/logistics-dashboard" },
          { label: "Projects", href: "/dashboards/projects" },
          { label: "HRM", href: "/dashboards/hrm-dashboard" },
          { label: "School Management", href: "/dashboards/school-management" },
          { label: "Restaurant POS", href: "/dashboards/restaurant-pos" },
          { label: "Finance", href: "/dashboards/finance" },
          { label: "Marketing", href: "/dashboards/marketing" },
          { label: "SaaS", href: "/dashboards/saas" },
        ],
      },
    ],
  },
  {
    title: "Apps",
    items: [
      { label: "Email", href: "/apps/email", icon: "Mail" },
      { label: "Chat", href: "/apps/chat", icon: "MessageSquare" },
      { label: "AI Chat", href: "/apps/ai-chat", icon: "Bot" },
      { label: "Calendar", href: "/apps/calendar", icon: "Calendar" },
      { label: "Tasks", href: "/apps/tasks", icon: "CircleCheck" },
      { label: "Notes", href: "/apps/notes", icon: "NotebookPen" },
      { label: "Kanban", href: "/apps/kanban", icon: "Columns3" },
      { label: "File Manager", href: "/apps/files", icon: "FolderOpen" },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "eCommerce",
        href: "/ecommerce",
        icon: "ShoppingBag",
        children: [
          { label: "Products", href: "/ecommerce/products" },
          { label: "Add Product", href: "/ecommerce/add-product" },
          { label: "Product Details", href: "/ecommerce/product-details" },
          { label: "Orders", href: "/ecommerce/orders" },
          { label: "Customers", href: "/ecommerce/customers" },
          { label: "Checkout", href: "/ecommerce/checkout" },
        ],
      },
      {
        label: "CRM",
        href: "/crm",
        icon: "Users",
        children: [
          { label: "Contacts", href: "/crm/contacts" },
          { label: "Companies", href: "/crm/companies" },
          { label: "Leads", href: "/crm/leads" },
          { label: "Deals", href: "/crm/deals" },
          { label: "Pipeline", href: "/crm/pipeline" },
        ],
      },
      {
        label: "Projects",
        href: "/projects",
        icon: "Briefcase",
        children: [
          { label: "Project List", href: "/projects/list" },
          { label: "Project Grid", href: "/projects/grid" },
          { label: "Project Details", href: "/projects/detail" },
          { label: "Team", href: "/projects/team" },
        ],
      },
      {
        label: "Finance",
        href: "/finance",
        icon: "Wallet",
        children: [
          { label: "Transactions", href: "/finance/transactions" },
          { label: "Invoices", href: "/finance/invoices" },
          { label: "Expenses", href: "/finance/expenses" },
          { label: "Budgets", href: "/finance/budgets" },
        ],
      },

      {
        label: "Crypto",
        href: "/crypto",
        icon: "Coins",
        children: [
          { label: "Market", href: "/crypto/market" },
          { label: "Wallet", href: "/crypto/wallet" },
          { label: "Exchange", href: "/crypto/exchange" },
          { label: "Transactions", href: "/crypto/transactions" },
        ],
      },
      {
        label: "AI Analytics",
        href: "/ai-analytics",
        icon: "BrainCircuit",
        children: [
          { label: "AI Insights", href: "/ai-analytics/insights" },
          { label: "Chatbot Assistant", href: "/ai-analytics/chatbot-conversations" },
          { label: "Predictions", href: "/ai-analytics/predictions" },
          { label: "Model Settings", href: "/ai-analytics/model-settings" },
        ],
      },
      {
        label: "School Management",
        href: "/school",
        icon: "GraduationCap",
        children: [
          { label: "Students", href: "/school/students" },
          { label: "Classes", href: "/school/classes" },
          { label: "Attendance", href: "/school/attendance" },
          { label: "Exams", href: "/school/exams" },
        ],
      },
      {
        label: "HRM",
        href: "/hrm",
        icon: "Briefcase",
        children: [
          { label: "Employees", href: "/hrm/employees" },
          { label: "Payroll", href: "/hrm/payroll" },
          { label: "Leave Requests", href: "/hrm/leave-requests" },
          { label: "Performance Reviews", href: "/hrm/reviews" },
        ],
      },
      {
        label: "Hospital Management",
        href: "/hospital",
        icon: "Hospital",
        children: [
          { label: "Patients", href: "/hospital/patients" },
          { label: "Doctors", href: "/hospital/doctors" },
          { label: "Appointments", href: "/hospital/appointments" },
          { label: "Wards & Beds", href: "/hospital/wards" },
          { label: "Pharmacy", href: "/hospital/pharmacy" },
          { label: "Ambulance", href: "/hospital/ambulance" },
          { label: "Billing", href: "/hospital/billing" },
        ],
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: "FileText",
        children: [
          { label: "Invoice List", href: "/invoices/list" },
          { label: "Invoice Details", href: "/invoices/detail" },
          { label: "Create Invoice", href: "/invoices/create" },
        ],
      },
      {
        label: "Logistics",
        href: "/logistics/inventory",
        icon: "Truck",
        children: [
          { label: "Inventory", href: "/logistics/inventory" },
          { label: "Stock Transfer", href: "/logistics/stock-transfer" },
          { label: "Purchase Orders", href: "/logistics/purchase-orders" },
          { label: "Suppliers", href: "/logistics/suppliers" },
          { label: "Shipments", href: "/logistics/shipments" },
        ],
      },
    ],
  },
  {
    title: "Pages",
    items: [
      { label: "Profile", href: "/pages/profile", icon: "User" },
      { label: "Settings", href: "/pages/settings", icon: "Settings" },
      { label: "Pricing", href: "/pages/pricing", icon: "Tag" },
      { label: "FAQ", href: "/pages/faq", icon: "CircleHelp" },
    ],
  },
  {
    title: "Components",
    items: [
      {
        label: "UI Elements",
        href: "/ui/buttons",
        icon: "Component",
        children: [
          { label: "Buttons", href: "/ui/buttons" },
          { label: "Badges", href: "/ui/badges" },
          { label: "Alerts", href: "/ui/alerts" },
          { label: "Avatars", href: "/ui/avatars" },
          { label: "Dropdowns", href: "/ui/dropdowns" },
          { label: "Tabs", href: "/ui/tabs" },
          { label: "Accordions", href: "/ui/accordions" },
          { label: "Modals", href: "/ui/modals" },
          { label: "Drawers", href: "/ui/drawers" },
          { label: "Tooltips", href: "/ui/tooltips" },
          { label: "Progress", href: "/ui/progress" },
          { label: "Pagination", href: "/ui/pagination" },
          { label: "Breadcrumbs", href: "/ui/breadcrumbs" },
          { label: "Toasts", href: "/ui/toasts" },
          { label: "Loaders", href: "/ui/loaders" },
          { label: "Cards", href: "/ui/cards" },
          { label: "Lists", href: "/ui/lists" },
          { label: "Typography", href: "/ui/typography" },
          { label: "Data Tables", href: "/ui/tables" },
          { label: "Navigation", href: "/ui/navigation" },
          { label: "Chips & Tags", href: "/ui/chips" },
          { label: "Dividers", href: "/ui/dividers" },
          { label: "Empty States", href: "/ui/empty-states" },
          { label: "Timelines", href: "/ui/timelines" },
          { label: "Layouts & Grid", href: "/ui/layouts" },
          { label: "Borders & Shadows", href: "/ui/surfaces" },
          { label: "Transitions", href: "/ui/transitions" },
        ],
      },
      {
        label: "Forms",
        href: "/forms/elements",
        icon: "SquarePen",
        children: [
          { label: "Form Elements", href: "/forms/elements" },
          { label: "Checks & Switches", href: "/forms/checks-switches-radios" },
          { label: "Select Components", href: "/forms/select-components" },
          { label: "Form Layouts", href: "/forms/layouts" },
          { label: "Form Plugins", href: "/forms/plugins" },
          { label: "Date Pickers", href: "/forms/date-pickers" },
          { label: "Form Validation", href: "/forms/validation" },
          { label: "Inline Editable", href: "/forms/inline-editable" },
          { label: "Multi-step Wizard", href: "/forms/multi-step-wizard" },
          { label: "Editors", href: "/forms/editors" },
        ],
      },
      {
        label: "Tables",
        href: "/tables/basic",
        icon: "Table",
        children: [
          { label: "Basic Table", href: "/tables/basic" },
          { label: "Responsive Table", href: "/tables/responsive" },
          { label: "Filter Table", href: "/tables/filter" },
          { label: "Data Table", href: "/tables/data" },
          { label: "Advanced Table", href: "/tables/advanced" },
        ],
      },
      {
        label: "Charts",
        href: "/charts/apex",
        icon: "ChartColumn",
        children: [
          { label: "Apex Charts", href: "/charts/apex" },
          { label: "Line Charts", href: "/charts/line" },
          { label: "Area Charts", href: "/charts/area" },
          { label: "Bar Charts", href: "/charts/bar" },
          { label: "Pie & Donut", href: "/charts/pie" },
          { label: "Radar Charts", href: "/charts/radar" },
          { label: "Radial Charts", href: "/charts/radial" },
          { label: "Scatter & Bubble", href: "/charts/scatter" },
          { label: "Mixed Charts", href: "/charts/mixed" },
          { label: "Heatmap Charts", href: "/charts/heatmap" },
          { label: "Treemap Charts", href: "/charts/treemap" },
          { label: "Sparklines", href: "/charts/sparkline" },
        ],
      },
      { label: "Icons", href: "/ui/icons", icon: "Sparkles" },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        label: "Authentication",
        href: "/auth/sign-in/basic",
        icon: "ShieldCheck",
        children: [
          {
            label: "Sign In",
            href: "/auth/sign-in",
            icon: "LogIn",
            children: [
              { label: "Basic", href: "/auth/sign-in/basic" },
              { label: "Cover", href: "/auth/sign-in/cover" },
            ],
          },
          {
            label: "Sign Up",
            href: "/auth/sign-up",
            icon: "UserPlus",
            children: [
              { label: "Basic", href: "/auth/sign-up/basic" },
              { label: "Cover", href: "/auth/sign-up/cover" },
            ],
          },
          {
            label: "Forgot Password",
            href: "/auth/forgot-password/basic",
            icon: "KeyRound",
            children: [
              { label: "Basic", href: "/auth/forgot-password/basic" },
              { label: "Cover", href: "/auth/forgot-password/cover" },
            ],
          },
          {
            label: "Reset Password",
            href: "/auth/reset-password/basic",
            icon: "RotateCcw",
            children: [
              { label: "Basic", href: "/auth/reset-password/basic" },
              { label: "Cover", href: "/auth/reset-password/cover" },
            ],
          },
          {
            label: "Verify Email",
            href: "/auth/verify-email/basic",
            icon: "MailCheck",
            children: [
              { label: "Basic", href: "/auth/verify-email/basic" },
              { label: "Cover", href: "/auth/verify-email/cover" },
            ],
          },
          {
            label: "Two-Step Verification",
            href: "/auth/two-step/basic",
            icon: "ShieldCheck",
            children: [
              { label: "Basic", href: "/auth/two-step/basic" },
              { label: "Cover", href: "/auth/two-step/cover" },
            ],
          },
          {
            label: "Lock Screen",
            href: "/auth/lock-screen/basic",
            icon: "LockKeyhole",
            children: [
              { label: "Basic", href: "/auth/lock-screen/basic" },
              { label: "Cover", href: "/auth/lock-screen/cover" },
            ],
          },
        ],
      },
      {
        label: "Email Templates",
        href: "/auth/email-templates",
        icon: "Mails",
        children: [
          { label: "Welcome", href: "/auth/email-templates/welcome" },
          { label: "Verify Email", href: "/auth/email-templates/verify-email" },
          { label: "Reset Password", href: "/auth/email-templates/reset-password" },
          { label: "Password Changed", href: "/auth/email-templates/password-changed" },
          { label: "Invitation", href: "/auth/email-templates/invitation" },
          { label: "Invoice", href: "/auth/email-templates/invoice" },
          { label: "Order Confirmation", href: "/auth/email-templates/order-confirmation" },
          { label: "Payment Received", href: "/auth/email-templates/payment-received" },
          { label: "Project Assignment", href: "/auth/email-templates/project-assignment" },
          { label: "Task Assignment", href: "/auth/email-templates/task-assignment" },
          { label: "Subscription", href: "/auth/email-templates/subscription" },
          { label: "Notification", href: "/auth/email-templates/notification" },
        ],
      },
      {
        label: "Error Pages",
        href: "/auth/errors",
        icon: "TriangleAlert",
        children: [
          { label: "Page 404", href: "/auth/errors/404" },
          { label: "Page 500", href: "/auth/errors/500" },
          { label: "Page 503", href: "/auth/errors/503" },
          { label: "Maintenance", href: "/auth/errors/maintenance" },
        ],
      },
    ],
  },
];
