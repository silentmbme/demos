import { getUserImage } from "@/lib/user-images";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* =====================================================
   Types
===================================================== */

type Status = "Active" | "Prospect" | "Customer" | "Partner" | "At Risk" | "Inactive" | "Archived";

type Company = {
  id: number;
  name: string;
  domain: string;
  industry: string;
  size: string;
  revenue: number;
  status: Status;
  owner: string;
  country: string;
  contacts: number;
  deals: number;
  pipeline: number;
  activity: string;
  days: number | null;
  followUp: string;
  tags: string[];
  notes: string[];
  tasks: string[];
  initials: string;
};

type Modal =
  | "add"
  | "edit"
  | "contact"
  | "deal"
  | "note"
  | "task"
  | "owner"
  | "archive"
  | "delete"
  | "bulkOwner"
  | "bulkStatus"
  | "bulkTag"
  | "bulkDelete"
  | null;

/* =====================================================
   Constants
===================================================== */

const owners = ["Sophia Carter", "Daniel Lee", "Olivia Smith", "Emma Wilson"];

const seed: Company[] = [
  {
    id: 1,
    name: "CloudAxis",
    domain: "cloudaxis.com",
    industry: "SaaS",
    size: "201-500",
    revenue: 48_000_000,
    status: "Customer",
    owner: "Sophia Carter",
    country: "United States",
    contacts: 18,
    deals: 3,
    pipeline: 284_000,
    activity: "Proposal viewed",
    days: 0,
    followUp: "Aug 28",
    tags: ["Enterprise", "Strategic"],
    notes: ["Expansion proposal received positive feedback."],
    tasks: ["Confirm procurement review"],
    initials: "CA",
  },
  {
    id: 2,
    name: "Vertex Labs",
    domain: "vertexlabs.com",
    industry: "Technology",
    size: "51-200",
    revenue: 22_000_000,
    status: "Prospect",
    owner: "Daniel Lee",
    country: "United Kingdom",
    contacts: 12,
    deals: 2,
    pipeline: 142_000,
    activity: "Demo completed",
    days: 2,
    followUp: "Aug 30",
    tags: ["High Growth", "Technical Buyer"],
    notes: ["Security review is the next decision gate."],
    tasks: ["Share security documentation"],
    initials: "VL",
  },
  {
    id: 3,
    name: "Vexui Systems",
    domain: "vexuisystems.com",
    industry: "Software",
    size: "501-1000",
    revenue: 96_000_000,
    status: "Customer",
    owner: "Olivia Smith",
    country: "Canada",
    contacts: 24,
    deals: 5,
    pipeline: 486_000,
    activity: "Deal moved to Negotiation",
    days: 1,
    followUp: "Today",
    tags: ["Enterprise", "Renewal", "VIP"],
    notes: ["Renewal and rollout deals are progressing."],
    tasks: ["Prepare renewal options"],
    initials: "NS",
  },
  {
    id: 4,
    name: "BrightWorks",
    domain: "brightworks.io",
    industry: "Professional Services",
    size: "51-200",
    revenue: 18_000_000,
    status: "At Risk",
    owner: "Emma Wilson",
    country: "Germany",
    contacts: 8,
    deals: 1,
    pipeline: 64_000,
    activity: "No activity",
    days: 46,
    followUp: "Overdue",
    tags: ["At Risk"],
    notes: ["Budget review delayed buying decision."],
    tasks: ["Re-engage account owner"],
    initials: "BW",
  },
  {
    id: 5,
    name: "Acme Inc.",
    domain: "acmeinc.com",
    industry: "Finance",
    size: "1000+",
    revenue: 180_000_000,
    status: "Partner",
    owner: "Sophia Carter",
    country: "India",
    contacts: 32,
    deals: 4,
    pipeline: 320_000,
    activity: "Contact added",
    days: 6,
    followUp: "Sep 02",
    tags: ["Partner", "Enterprise"],
    notes: [],
    tasks: ["Plan partner webinar"],
    initials: "AI",
  },
];

const tones: Record<Status, "success" | "primary" | "info" | "warning" | "muted"> = {
  Active: "success",
  Prospect: "primary",
  Customer: "success",
  Partner: "info",
  "At Risk": "warning",
  Inactive: "warning",
  Archived: "muted",
};

const blank = {
  name: "",
  domain: "",
  industry: "SaaS",
  size: "51-200",
  revenue: "0",
  status: "Prospect" as Status,
  owner: "Sophia Carter",
  country: "United States",
  tags: "",
  notes: "",
};

/* =====================================================
   Company Form
===================================================== */

function CompanyForm({
  form,
  setForm,
}: {
  form: typeof blank;
  setForm: (value: typeof blank) => void;
}) {
  const input = (key: keyof typeof blank, label: string) => (
    <label className="grid gap-1 text-sm">
      <b>{label}</b>

      <input
        value={form[key]}
        onChange={(event) =>
          setForm({
            ...form,
            [key]: event.target.value,
          })
        }
        className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );

  const selectFields = ["industry", "size", "status", "owner", "country"] as const;

  const getOptions = (key: (typeof selectFields)[number]) => {
    if (key === "industry") {
      return [
        "Technology",
        "SaaS",
        "Finance",
        "Healthcare",
        "Retail",
        "Manufacturing",
        "Professional Services",
        "Education",
        "Media",
      ];
    }

    if (key === "size") {
      return ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
    }

    if (key === "status") {
      return ["Active", "Prospect", "Customer", "Partner", "At Risk", "Inactive", "Archived"];
    }

    if (key === "owner") {
      return owners;
    }

    return ["United States", "United Kingdom", "Germany", "India", "Canada", "Australia"];
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {input("name", "Company name")}
      {input("domain", "Domain")}

      {selectFields.map((key) => (
        <label key={key} className="grid gap-1 text-sm">
          <b>{key[0].toUpperCase() + key.slice(1)}</b>

          <select
            value={form[key]}
            onChange={(event) =>
              setForm({
                ...form,
                [key]: event.target.value,
              })
            }
            className="h-10 rounded-md border bg-background px-3"
          >
            {getOptions(key).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}

      {input("revenue", "Annual revenue")}
      {input("tags", "Tags (comma separated)")}

      <label className="grid gap-1 text-sm sm:col-span-2">
        <b>Notes</b>

        <textarea
          value={form.notes}
          onChange={(event) =>
            setForm({
              ...form,
              notes: event.target.value,
            })
          }
          rows={3}
          className="rounded-md border bg-background p-3"
        />
      </label>
    </div>
  );
}

/* =====================================================
   CRM Companies App
===================================================== */

export function CrmCompaniesApp() {
  const [companies, setCompanies] = useState(seed);

  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("All industries");
  const [size, setSize] = useState("All sizes");
  const [revenue, setRevenue] = useState("All revenue");
  const [status, setStatus] = useState("All statuses");
  const [owner, setOwner] = useState("All owners");
  const [country, setCountry] = useState("All regions");
  const [tag, setTag] = useState("All tags");
  const [activity, setActivity] = useState("Any activity");
  const [sort, setSort] = useState("Recently Added");

  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<Company | null>(null);
  const [modal, setModal] = useState<Modal>(null);

  const [form, setForm] = useState(blank);
  const [text, setText] = useState("");
  const [bulk, setBulk] = useState("Sophia Carter");

  const [pageSize, setPageSize] = useState(20);

  /* ===================================================
     Filter + Sort Companies
  =================================================== */

  const filtered = useMemo(() => {
    return companies
      .filter((company) => {
        const search =
          !q ||
          [
            company.name,
            company.domain,
            company.industry,
            company.country,
            company.owner,
            ...company.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q.toLowerCase());

        const revenueMatch =
          revenue === "All revenue" ||
          (revenue === "Under $1M" && company.revenue < 1e6) ||
          (revenue === "$1M-$10M" && company.revenue >= 1e6 && company.revenue <= 1e7) ||
          (revenue === "$10M-$50M" && company.revenue > 1e7 && company.revenue <= 5e7) ||
          (revenue === "$50M-$100M" && company.revenue > 5e7 && company.revenue <= 1e8) ||
          (revenue === "$100M+" && company.revenue > 1e8);

        const activityMatch =
          activity === "Any activity" ||
          (activity === "Today" && company.days === 0) ||
          (activity === "Last 7 Days" && (company.days ?? 99) <= 7) ||
          (activity === "Last 30 Days" && (company.days ?? 99) <= 30) ||
          (activity === "No Activity" && company.days === null) ||
          (activity === "Overdue Follow-up" && company.followUp === "Overdue");

        return (
          search &&
          (industry === "All industries" || company.industry === industry) &&
          (size === "All sizes" || company.size === size) &&
          revenueMatch &&
          (status === "All statuses" || company.status === status) &&
          (owner === "All owners" || company.owner === owner) &&
          (country === "All regions" || company.country === country) &&
          (tag === "All tags" || company.tags.includes(tag)) &&
          activityMatch
        );
      })
      .sort((a, b) => {
        if (sort === "Company A-Z") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "Highest Revenue") {
          return b.revenue - a.revenue;
        }

        if (sort === "Largest Company") {
          return parseInt(b.size) - parseInt(a.size);
        }

        if (sort === "Highest Pipeline Value") {
          return b.pipeline - a.pipeline;
        }

        if (sort === "Most Contacts") {
          return b.contacts - a.contacts;
        }

        if (sort === "Last Activity") {
          return (a.days ?? 99) - (b.days ?? 99);
        }

        return b.id - a.id;
      });
  }, [companies, q, industry, size, revenue, status, owner, country, tag, activity, sort]);

  const visible = filtered.slice(0, pageSize);

  const all = visible.length > 0 && visible.every((company) => selected.includes(company.id));

  /* ===================================================
     Update Company
  =================================================== */

  const updateCompany = (id: number, patch: Partial<Company>, message: string) => {
    setCompanies((current) =>
      current.map((company) => (company.id === id ? { ...company, ...patch } : company)),
    );

    setActive((company) => (company?.id === id ? { ...company, ...patch } : company));

    toast.success(message);
  };

  /* ===================================================
     Reset Filters
  =================================================== */

  const resetFilters = () => {
    setQ("");
    setIndustry("All industries");
    setSize("All sizes");
    setRevenue("All revenue");
    setStatus("All statuses");
    setOwner("All owners");
    setCountry("All regions");
    setTag("All tags");
    setActivity("Any activity");
    setSort("Recently Added");
  };

  /* ===================================================
     CSV Export
  =================================================== */

  const exportCsv = (rows = filtered) => {
    const csv = [
      "Company,Domain,Industry,Owner,Pipeline,Status",
      ...rows.map((company) =>
        [
          company.name,
          company.domain,
          company.industry,
          company.owner,
          company.pipeline,
          company.status,
        ].join(","),
      ),
    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    link.download = "crm-companies.csv";
    link.click();

    URL.revokeObjectURL(link.href);

    toast.success("Companies export downloaded");
  };

  /* ===================================================
     Edit Company
  =================================================== */

  const editCompany = (company: Company) => {
    setActive(company);

    setForm({
      name: company.name,
      domain: company.domain,
      industry: company.industry,
      size: company.size,
      revenue: String(company.revenue),
      status: company.status,
      owner: company.owner,
      country: company.country,
      tags: company.tags.join(", "),
      notes: company.notes.join(" "),
    });

    setModal("edit");
  };

  /* ===================================================
     Save Company
  =================================================== */

  const saveCompany = () => {
    if (
      !form.name ||
      (form.domain && !/^\S+\.\S+$/.test(form.domain)) ||
      Number(form.revenue) < 0
    ) {
      toast.error("Enter a company name, valid domain and non-negative revenue");
      return;
    }

    const patch = {
      name: form.name,
      domain: form.domain,
      industry: form.industry,
      size: form.size,
      revenue: Number(form.revenue),
      status: form.status,
      owner: form.owner,
      country: form.country,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: form.notes ? [form.notes] : [],
    };

    if (modal === "add") {
      setCompanies((current) => [
        ...current,
        {
          ...patch,
          id: Date.now(),
          contacts: 0,
          deals: 0,
          pipeline: 0,
          activity: "Company created",
          days: 0,
          followUp: "Not scheduled",
          tasks: [],
          initials: form.name
            .split(" ")
            .map((item) => item[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        },
      ]);

      toast.success("Company created");
    } else if (active) {
      updateCompany(active.id, patch, "Company updated");
    }

    setModal(null);
  };

  /* ===================================================
     Confirm Dialog Action
  =================================================== */

  const confirmAction = () => {
    if (modal === "bulkOwner") {
      setCompanies((current) =>
        current.map((company) =>
          selected.includes(company.id) ? { ...company, owner: bulk } : company,
        ),
      );
    } else if (modal === "bulkStatus") {
      setCompanies((current) =>
        current.map((company) =>
          selected.includes(company.id)
            ? {
                ...company,
                status: bulk as Status,
              }
            : company,
        ),
      );
    } else if (modal === "bulkTag") {
      setCompanies((current) =>
        current.map((company) =>
          selected.includes(company.id)
            ? {
                ...company,
                tags: [...company.tags, bulk],
              }
            : company,
        ),
      );
    } else if (modal === "bulkDelete") {
      setCompanies((current) => current.filter((company) => !selected.includes(company.id)));

      setSelected([]);
    } else if (active && modal === "note" && text) {
      updateCompany(
        active.id,
        {
          notes: [...active.notes, text],
        },
        "Note added",
      );
    } else if (active && modal === "task" && text) {
      updateCompany(
        active.id,
        {
          tasks: [...active.tasks, text],
        },
        "Task created",
      );
    } else if (active && modal === "owner") {
      updateCompany(active.id, { owner: bulk }, "Account owner assigned");
    } else if (active && modal === "archive") {
      updateCompany(active.id, { status: "Archived" }, "Company archived");
    } else if (active && modal === "delete") {
      setCompanies((current) => current.filter((company) => company.id !== active.id));

      setActive(null);

      toast.success("Company deleted from demo data");
    } else if (active && modal === "contact") {
      toast.success(`Contact added to ${active.name}`);
    } else if (active && modal === "deal") {
      toast.success(`Deal added to ${active.name}`);
    } else {
      return;
    }

    if (modal?.startsWith("bulk")) {
      toast.success("Bulk action completed");
    }

    setModal(null);
    setText("");
  };

  /* ===================================================
     Filter Configuration
  =================================================== */

  const filters = [
    [
      industry,
      setIndustry,
      [
        "All industries",
        "Technology",
        "SaaS",
        "Finance",
        "Healthcare",
        "Retail",
        "Manufacturing",
        "Professional Services",
        "Education",
        "Media",
      ],
    ],
    [size, setSize, ["All sizes", "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]],
    [
      revenue,
      setRevenue,
      ["All revenue", "Under $1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"],
    ],
    [
      status,
      setStatus,
      [
        "All statuses",
        "Active",
        "Prospect",
        "Customer",
        "Partner",
        "At Risk",
        "Inactive",
        "Archived",
      ],
    ],
    [owner, setOwner, ["All owners", ...owners]],
    [
      country,
      setCountry,
      ["All regions", "United States", "United Kingdom", "Germany", "India", "Canada", "Australia"],
    ],
    [
      tag,
      setTag,
      ["All tags", "Enterprise", "Strategic", "Renewal", "High Growth", "Partner", "High Intent"],
    ],
    [
      activity,
      setActivity,
      ["Any activity", "Today", "Last 7 Days", "Last 30 Days", "No Activity", "Overdue Follow-up"],
    ],
    [
      sort,
      setSort,
      [
        "Recently Added",
        "Recently Updated",
        "Company A-Z",
        "Highest Revenue",
        "Largest Company",
        "Highest Pipeline Value",
        "Most Contacts",
        "Last Activity",
      ],
    ],
  ];

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Companies"
        subtitle="Manage customer accounts, ownership, contacts and pipeline activity."
        breadcrumb={["Vexui", "CRM", "Companies"]}
        actions={
          <>
            <Button variant="outline" onClick={() => exportCsv()}>
              <Icons.Download />
              Export
            </Button>

            <Button
              onClick={() => {
                setForm(blank);
                setModal("add");
              }}
            >
              <Icons.Building2 />
              Add company
            </Button>
          </>
        }
      />

      {/* =================================================
          Statistics
      ================================================= */}

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Companies", "3,842"],
            ["Active Accounts", "3,126"],
            ["Enterprise", "426"],
            ["New This Month", "184"],
            ["At Risk", "72"],
            ["Pipeline Value", "$4.86M"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[140px] flex-1 px-5 py-3">
              <small className="text-muted-foreground">{label}</small>

              <b className="block text-lg">{value}</b>
            </div>
          ))}
        </div>
      </Card>

      {/* =================================================
          Companies Table
      ================================================= */}

      <Card bodyClassName="p-0">
        {/* Search + Filters */}

        <div className="border-b p-4">
          <label className="relative mb-3 block max-w-md">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search company, domain, owner or tag"
              className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map(([value, setter, options], index) => (
              <select
                key={index}
                value={value as string}
                onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                className="h-9 max-w-40 rounded-md border bg-background px-2 text-sm"
              >
                {(options as string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ))}

            <Button size="sm" variant="ghost" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-primary/5 px-4 py-2">
            <b className="text-sm">{selected.length} selected</b>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulk("Sophia Carter");
                setModal("bulkOwner");
              }}
            >
              Assign owner
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulk("Customer");
                setModal("bulkStatus");
              }}
            >
              Change status
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulk("Strategic");
                setModal("bulkTag");
              }}
            >
              Add tag
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCompanies((current) =>
                  current.map((company) =>
                    selected.includes(company.id) ? { ...company, status: "Archived" } : company,
                  ),
                );

                toast.success("Selected companies archived");
              }}
            >
              Archive
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportCsv(companies.filter((company) => selected.includes(company.id)))
              }
            >
              Export
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setModal("bulkDelete")}>
              Delete
            </Button>
          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all visible companies"
                    checked={all}
                    onChange={() => setSelected(all ? [] : visible.map((company) => company.id))}
                  />
                </th>

                {[
                  "Company",
                  "Industry",
                  "Size",
                  "Owner",
                  "Contacts",
                  "Open deals",
                  "Pipeline value",
                  "Status",
                  "Last activity",
                  "",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visible.map((company) => (
                <tr key={company.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${company.name}`}
                      checked={selected.includes(company.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(company.id)
                            ? current.filter((id) => id !== company.id)
                            : [...current, company.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(company)}
                      className="flex items-center gap-2 text-start"
                    >
                      <img
                        src={getUserImage(company.name)}
                        alt={company.name}
                        className="grid size-8 place-items-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary object-cover"
                      />

                      <span>
                        <b className="block hover:text-primary">{company.name}</b>

                        <small className="text-muted-foreground">{company.domain}</small>
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-4">{company.industry}</td>

                  <td className="px-3 py-4">{company.size} employees</td>

                  <td className="px-3 py-4">
                    <span className="flex items-center gap-1">
                      <span className="grid size-6 place-items-center rounded-full bg-muted text-[9px]">
                        {company.owner
                          .split(" ")
                          .map((item) => item[0])
                          .join("")}
                      </span>

                      {company.owner}
                    </span>
                  </td>

                  <td className="px-3 py-4 font-medium">{company.contacts}</td>

                  <td className="px-3 py-4">{company.deals}</td>

                  <td className="px-3 py-4 font-semibold">
                    ${(company.pipeline / 1000).toFixed(0)}K
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={tones[company.status]}>{company.status}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <p>
                      {company.days === 0
                        ? "Today"
                        : company.days
                          ? `${company.days} days ago`
                          : "No activity"}
                    </p>

                    <small className="text-muted-foreground">{company.activity}</small>
                  </td>

                  <td className="px-3 py-4">
                    <Button size="sm" variant="outline" onClick={() => setActive(company)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}

        {!visible.length && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Icons.Building2 className="size-8 text-muted-foreground" />

            <b>No matching companies</b>

            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>

            <Button size="sm" variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Pagination */}

        <div className="flex justify-between flex-wrap gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing 1-{visible.length} of 3,842 companies</span>

          <div className="flex gap-2">
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="h-8 rounded border bg-background px-2 text-xs"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>

            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* =================================================
          Company Details Sheet
      ================================================= */}

      <Sheet
        open={Boolean(active) && !modal}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{active?.name}</SheetTitle>

            <SheetDescription>
              {active?.domain} {active?.industry}
            </SheetDescription>
          </SheetHeader>

          {active && (
            <div className="mt-6 space-y-5">
              {/* Company Overview */}

              <div className="flex items-center gap-3">
                <img
                  src={getUserImage(active.name)}
                  alt={active.name}
                  className="grid size-12 place-items-center rounded-lg bg-primary/10 font-semibold text-primary object-cover"
                />

                <div>
                  <b>{active.name}</b>

                  <p className="text-sm text-muted-foreground">
                    {active.size} employees ${Math.round(active.revenue / 1e6)}M annual revenue
                  </p>

                  <div className="mt-1 flex gap-1">
                    <Badge tone={tones[active.status]}>{active.status}</Badge>

                    {active.tags.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Metrics */}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["Owner", active.owner],
                  ["Contacts", String(active.contacts)],
                  ["Open deals", String(active.deals)],
                  ["Pipeline value", `$${(active.pipeline / 1000).toFixed(0)}K`],
                  ["Won revenue", "$420K"],
                  ["Next follow-up", active.followUp],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border p-3">
                    <small className="text-muted-foreground">{label}</small>

                    <b className="mt-1 block text-sm">{value}</b>
                  </div>
                ))}
              </div>

              {/* Key Contacts */}

              <section>
                <h3 className="mb-2 font-semibold">Key contacts</h3>

                <div className="space-y-2">
                  {[
                    ["Ava Thompson", "VP Operations"],
                    ["Liam Brooks", "CTO"],
                    ["Emma Davis", "Head of Marketing"],
                  ].map(([name, role]) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                    >
                      <span className="grid size-8 place-items-center rounded-full bg-muted text-xs">
                        {name
                          .split(" ")
                          .map((item) => item[0])
                          .join("")}
                      </span>

                      <span>
                        <b>{name}</b>

                        <small className="block text-muted-foreground">{role}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Open Deals */}

              <section>
                <h3 className="mb-2 font-semibold">Open deals</h3>

                {[
                  ["Enterprise Expansion", "$128K", "Proposal"],
                  ["Automation Rollout", "$96K", "Negotiation"],
                  ["Support Renewal", "$60K", "Qualified"],
                ].map(([name, value, stage]) => (
                  <div
                    key={name}
                    className="mb-2 flex justify-between rounded-lg border p-3 text-sm"
                  >
                    <span>
                      <b>{name}</b>

                      <small className="block text-muted-foreground">{stage}</small>
                    </span>

                    <b>{value}</b>
                  </div>
                ))}
              </section>

              {/* Notes & Tasks */}

              <section>
                <div className="mb-2 flex justify-between">
                  <h3 className="font-semibold">Notes & tasks</h3>

                  <span>
                    <Button size="sm" variant="ghost" onClick={() => setModal("note")}>
                      Note
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => setModal("task")}>
                      Task
                    </Button>
                  </span>
                </div>

                {active.notes.map((note, index) => (
                  <p key={index} className="mb-2 rounded-lg border p-3 text-sm">
                    {note}
                  </p>
                ))}

                {active.tasks.map((task, index) => (
                  <p key={index} className="mb-2 rounded-lg border p-3 text-sm">
                    {task}
                  </p>
                ))}
              </section>

              {/* Actions */}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => editCompany(active)}>
                  Edit company
                </Button>

                <Button variant="outline" onClick={() => setModal("contact")}>
                  Add contact
                </Button>

                <Button variant="outline" onClick={() => setModal("deal")}>
                  Add deal
                </Button>

                <Button variant="outline" onClick={() => setModal("owner")}>
                  Assign owner
                </Button>

                <Button variant="outline" onClick={() => setModal("archive")}>
                  Archive
                </Button>

                <Button variant="destructive" onClick={() => setModal("delete")}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* =================================================
          Action Dialog
      ================================================= */}

      <Dialog
        open={Boolean(modal)}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Company"
                : modal === "edit"
                  ? "Edit Company"
                  : modal === "contact"
                    ? "Add Contact"
                    : modal === "deal"
                      ? "Add Deal"
                      : modal === "note"
                        ? "Add Company Note"
                        : modal === "task"
                          ? "Create Follow-up Task"
                          : modal === "owner" || modal === "bulkOwner"
                            ? "Assign Account Owner"
                            : modal === "archive"
                              ? "Archive this company?"
                              : modal === "delete"
                                ? "Delete this company?"
                                : modal === "bulkStatus"
                                  ? "Change company status"
                                  : modal === "bulkTag"
                                    ? "Add tag to selected companies"
                                    : "Delete selected companies?"}
            </DialogTitle>

            <DialogDescription>
              {modal === "delete" || modal === "bulkDelete"
                ? "This company may have contacts and open deals. Demo deletion removes it only from local data."
                : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {/* Company Form */}

          {(modal === "add" || modal === "edit") && <CompanyForm form={form} setForm={setForm} />}

          {/* Text Actions */}

          {["contact", "deal", "note", "task"].includes(modal ?? "") && (
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={
                modal === "contact"
                  ? "Contact name and email"
                  : modal === "deal"
                    ? "Deal name and value"
                    : modal === "note"
                      ? "Write an internal note"
                      : "Task title"
              }
              className="h-10 w-full rounded-md border bg-background px-3"
            />
          )}

          {/* Owner */}

          {["owner", "bulkOwner"].includes(modal ?? "") && (
            <select
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {owners.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          )}

          {/* Status */}

          {modal === "bulkStatus" && (
            <select
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {(["Prospect", "Customer", "Partner", "At Risk", "Inactive"] as Status[]).map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
          )}

          {/* Tag */}

          {modal === "bulkTag" && (
            <input
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            />
          )}

          {/* Dialog Actions */}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>

            <Button
              variant={modal === "delete" || modal === "bulkDelete" ? "destructive" : "default"}
              onClick={modal === "add" || modal === "edit" ? saveCompany : confirmAction}
            >
              {modal === "add"
                ? "Create Company"
                : modal === "edit"
                  ? "Save Changes"
                  : modal === "archive"
                    ? "Archive"
                    : modal === "delete" || modal === "bulkDelete"
                      ? "Delete"
                      : modal === "contact"
                        ? "Add Contact"
                        : modal === "deal"
                          ? "Add Deal"
                          : modal === "note"
                            ? "Add Note"
                            : modal === "task"
                              ? "Create Task"
                              : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
