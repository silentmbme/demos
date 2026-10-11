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

type Stage =
  | "Qualification"
  | "Discovery"
  | "Proposal"
  | "Negotiation"
  | "Contract"
  | "Closed Won"
  | "Closed Lost"
  | "Archived";

type Deal = {
  id: number;
  name: string;
  company: string;
  contact: string;
  role: string;
  stage: Stage;
  prob: number;
  value: number;
  owner: string;
  close: string;
  closeType: string;
  source: string;
  next: string;
  activity: string;
  tags: string[];
  notes: string[];
  tasks: string[];
};

type Modal =
  | "add"
  | "edit"
  | "note"
  | "task"
  | "activity"
  | "owner"
  | "stage"
  | "won"
  | "lost"
  | "archive"
  | "delete"
  | "bulkOwner"
  | "bulkStage"
  | "bulkTag"
  | "bulkDelete"
  | null;

/* =====================================================
   Constants
===================================================== */

const owners = ["Sophia Carter", "Daniel Lee", "Olivia Smith", "Emma Wilson"];

const stages: Stage[] = [
  "Qualification",
  "Discovery",
  "Proposal",
  "Negotiation",
  "Contract",
  "Closed Won",
  "Closed Lost",
  "Archived",
];

const seed: Deal[] = [
  {
    id: 1048,
    name: "Enterprise Expansion",
    company: "CloudAxis",
    contact: "Ava Thompson",
    role: "VP Operations",
    stage: "Proposal",
    prob: 76,
    value: 84500,
    owner: "Sophia Carter",
    close: "Sep 12",
    closeType: "This Month",
    source: "LinkedIn",
    next: "Demo Follow-up",
    activity: "Proposal opened",
    tags: ["Enterprise", "Expansion"],
    notes: ["Proposal is with the buying committee."],
    tasks: ["Schedule pricing review"],
  },
  {
    id: 1049,
    name: "Automation Rollout",
    company: "Vertex Labs",
    contact: "Liam Brooks",
    role: "CTO",
    stage: "Negotiation",
    prob: 68,
    value: 42000,
    owner: "Daniel Lee",
    close: "Sep 18",
    closeType: "This Month",
    source: "Referral",
    next: "Security review",
    activity: "Pricing updated",
    tags: ["Strategic"],
    notes: ["Legal review begins this week."],
    tasks: ["Send updated terms"],
  },
  {
    id: 1050,
    name: "Marketing Platform Upgrade",
    company: "Vexui Systems",
    contact: "Emma Davis",
    role: "Head of Marketing",
    stage: "Contract",
    prob: 88,
    value: 128000,
    owner: "Olivia Smith",
    close: "Sep 05",
    closeType: "This Week",
    source: "Event",
    next: "Contract review",
    activity: "Contract uploaded",
    tags: ["Renewal", "Upsell"],
    notes: ["Final approval expected soon."],
    tasks: ["Confirm signature date"],
  },
  {
    id: 1051,
    name: "Support Renewal",
    company: "BrightWorks",
    contact: "Noah Walker",
    role: "Procurement Manager",
    stage: "Discovery",
    prob: 42,
    value: 18000,
    owner: "Emma Wilson",
    close: "Oct 02",
    closeType: "Next Month",
    source: "Existing Customer",
    next: "Needs discovery",
    activity: "Discovery call completed",
    tags: ["Renewal"],
    notes: [],
    tasks: ["Map requirements"],
  },
];

const tone: Record<Stage, "primary" | "info" | "success" | "warning" | "danger" | "muted"> = {
  Qualification: "primary",
  Discovery: "info",
  Proposal: "warning",
  Negotiation: "warning",
  Contract: "info",
  "Closed Won": "success",
  "Closed Lost": "danger",
  Archived: "muted",
};

const blank = {
  name: "",
  company: "CloudAxis",
  contact: "Ava Thompson",
  stage: "Qualification" as Stage,
  value: "0",
  prob: "50",
  owner: "Sophia Carter",
  source: "Inbound",
  close: "Sep 30",
  next: "Follow-up",
  tags: "",
  notes: "",
};

/* =====================================================
   Deal Form
===================================================== */

function Form({ f, setF }: { f: typeof blank; setF: (value: typeof blank) => void }) {
  const input = (key: keyof typeof blank, label: string) => (
    <label className="grid gap-1 text-sm">
      <b>{label}</b>

      <input
        value={f[key]}
        onChange={(event) =>
          setF({
            ...f,
            [key]: event.target.value,
          })
        }
        className="h-10 rounded-md border bg-background px-3"
      />
    </label>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {input("name", "Deal name")}

      <label className="grid gap-1 text-sm">
        <b>Company</b>

        <select
          value={f.company}
          onChange={(event) =>
            setF({
              ...f,
              company: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {["CloudAxis", "Vertex Labs", "Vexui Systems", "BrightWorks", "Acme Inc."].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      {input("contact", "Primary contact")}

      <label className="grid gap-1 text-sm">
        <b>Stage</b>

        <select
          value={f.stage}
          onChange={(event) =>
            setF({
              ...f,
              stage: event.target.value as Stage,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {stages.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      {input("value", "Value")}
      {input("prob", "Probability %")}

      <label className="grid gap-1 text-sm">
        <b>Owner</b>

        <select
          value={f.owner}
          onChange={(event) =>
            setF({
              ...f,
              owner: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {owners.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <b>Source</b>

        <select
          value={f.source}
          onChange={(event) =>
            setF({
              ...f,
              source: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {[
            "Inbound",
            "Referral",
            "LinkedIn",
            "Event",
            "Partner",
            "Outbound",
            "Existing Customer",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      {input("close", "Expected close")}
      {input("next", "Next activity")}
      {input("tags", "Tags")}
    </div>
  );
}

/* =====================================================
   CRM Deals App
===================================================== */

export function CrmDealsApp() {
  const [deals, setDeals] = useState(seed);

  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All stages");
  const [probability, setProbability] = useState("All probabilities");
  const [company, setCompany] = useState("All companies");
  const [owner, setOwner] = useState("All owners");
  const [value, setValue] = useState("All values");
  const [close, setClose] = useState("Any close");
  const [source, setSource] = useState("All sources");
  const [tag, setTag] = useState("All tags");
  const [sort, setSort] = useState("Recently Created");

  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<Deal | null>(null);
  const [modal, setModal] = useState<Modal>(null);

  const [form, setForm] = useState(blank);
  const [text, setText] = useState("");
  const [bulk, setBulk] = useState("Sophia Carter");

  /* ===================================================
     Filter & Sort
  =================================================== */

  const filtered = useMemo(() => {
    return deals
      .filter((deal) => {
        const matchesSearch =
          !query ||
          [deal.name, deal.company, deal.contact, deal.owner, deal.source, ...deal.tags]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());

        const matchesProbability =
          probability === "All probabilities" ||
          (probability === "0-25%" && deal.prob <= 25) ||
          (probability === "26-50%" && deal.prob > 25 && deal.prob <= 50) ||
          (probability === "51-75%" && deal.prob > 50 && deal.prob <= 75) ||
          (probability === "76-99%" && deal.prob > 75 && deal.prob < 100) ||
          (probability === "100%" && deal.prob === 100);

        const matchesValue =
          value === "All values" ||
          (value === "Under $10K" && deal.value < 10_000) ||
          (value === "$10K-$50K" && deal.value >= 10_000 && deal.value <= 50_000) ||
          (value === "$50K-$100K" && deal.value > 50_000 && deal.value <= 100_000) ||
          (value === "$100K-$250K" && deal.value > 100_000 && deal.value <= 250_000) ||
          (value === "$250K+" && deal.value > 250_000);

        return (
          matchesSearch &&
          (stage === "All stages" || deal.stage === stage) &&
          matchesProbability &&
          (company === "All companies" || deal.company === company) &&
          (owner === "All owners" || deal.owner === owner) &&
          matchesValue &&
          (close === "Any close" || deal.closeType === close) &&
          (source === "All sources" || deal.source === source) &&
          (tag === "All tags" || deal.tags.includes(tag))
        );
      })
      .sort((a, b) => {
        if (sort === "Highest Value") return b.value - a.value;
        if (sort === "Lowest Value") return a.value - b.value;
        if (sort === "Highest Probability") return b.prob - a.prob;
        if (sort === "Company A-Z") return a.company.localeCompare(b.company);
        if (sort === "Deal Name A-Z") return a.name.localeCompare(b.name);

        return b.id - a.id;
      });
  }, [deals, query, stage, probability, company, owner, value, close, source, tag, sort]);

  const all = filtered.length > 0 && filtered.every((deal) => selected.includes(deal.id));

  /* ===================================================
     Update Deal
  =================================================== */

  const updateDeal = (id: number, patch: Partial<Deal>, message: string) => {
    setDeals((current) => current.map((deal) => (deal.id === id ? { ...deal, ...patch } : deal)));

    setActive((deal) => (deal?.id === id ? { ...deal, ...patch } : deal));

    toast.success(message);
  };

  /* ===================================================
     Reset Filters
  =================================================== */

  const resetFilters = () => {
    setQuery("");
    setStage("All stages");
    setProbability("All probabilities");
    setCompany("All companies");
    setOwner("All owners");
    setValue("All values");
    setClose("Any close");
    setSource("All sources");
    setTag("All tags");
    setSort("Recently Created");
  };

  /* ===================================================
     CSV Export
  =================================================== */

  const exportCsv = (rows = filtered) => {
    const csv = [
      "Deal,Company,Stage,Probability,Value,Weighted",
      ...rows.map((deal) =>
        [
          deal.name,
          deal.company,
          deal.stage,
          deal.prob,
          deal.value,
          (deal.value * deal.prob) / 100,
        ].join(","),
      ),
    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    link.download = "crm-deals.csv";
    link.click();

    URL.revokeObjectURL(link.href);

    toast.success("Deals export downloaded");
  };

  /* ===================================================
     Edit Deal
  =================================================== */

  const editDeal = (deal: Deal) => {
    setActive(deal);

    setForm({
      name: deal.name,
      company: deal.company,
      contact: deal.contact,
      stage: deal.stage,
      value: String(deal.value),
      prob: String(deal.prob),
      owner: deal.owner,
      source: deal.source,
      close: deal.close,
      next: deal.next,
      tags: deal.tags.join(", "),
      notes: "",
    });

    setModal("edit");
  };

  /* ===================================================
     Save Deal
  =================================================== */

  const saveDeal = () => {
    if (!form.name || Number(form.value) < 0 || Number(form.prob) < 0 || Number(form.prob) > 100) {
      toast.error("Enter a deal name, non-negative value and probability from 0-100");
      return;
    }

    const patch = {
      name: form.name,
      company: form.company,
      contact: form.contact,
      stage: form.stage,
      value: Number(form.value),
      prob: Number(form.prob),
      owner: form.owner,
      source: form.source,
      close: form.close,
      next: form.next,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (modal === "add") {
      setDeals((current) => [
        ...current,
        {
          ...patch,
          id: Date.now(),
          role: "Decision Maker",
          closeType: "This Month",
          activity: "Deal created",
          notes: [],
          tasks: [],
        },
      ]);

      toast.success("Deal created");
    } else if (active) {
      updateDeal(active.id, patch, "Deal updated");
    }

    setModal(null);
  };

  /* ===================================================
     Modal Actions
  =================================================== */

  const confirmAction = () => {
    if (modal === "bulkOwner") {
      setDeals((current) =>
        current.map((deal) => (selected.includes(deal.id) ? { ...deal, owner: bulk } : deal)),
      );
    } else if (modal === "bulkStage") {
      setDeals((current) =>
        current.map((deal) =>
          selected.includes(deal.id) ? { ...deal, stage: bulk as Stage } : deal,
        ),
      );
    } else if (modal === "bulkTag") {
      setDeals((current) =>
        current.map((deal) =>
          selected.includes(deal.id) ? { ...deal, tags: [...deal.tags, bulk] } : deal,
        ),
      );
    } else if (modal === "bulkDelete") {
      setDeals((current) => current.filter((deal) => !selected.includes(deal.id)));

      setSelected([]);
    } else if (active && modal === "note" && text) {
      updateDeal(active.id, { notes: [...active.notes, text] }, "Note added");
    } else if (active && modal === "task" && text) {
      updateDeal(active.id, { tasks: [...active.tasks, text] }, "Task created");
    } else if (active && modal === "activity" && text) {
      updateDeal(active.id, { activity: text }, "Activity logged");
    } else if (active && modal === "owner") {
      updateDeal(active.id, { owner: bulk }, "Deal owner assigned");
    } else if (active && modal === "stage") {
      updateDeal(active.id, { stage: bulk as Stage }, "Deal stage updated");
    } else if (active && modal === "won") {
      updateDeal(
        active.id,
        {
          stage: "Closed Won",
          prob: 100,
        },
        "Deal marked won",
      );
    } else if (active && modal === "lost") {
      updateDeal(
        active.id,
        {
          stage: "Closed Lost",
          prob: 0,
        },
        "Deal marked lost",
      );
    } else if (active && modal === "archive") {
      updateDeal(active.id, { stage: "Archived" }, "Deal archived");
    } else if (active && modal === "delete") {
      setDeals((current) => current.filter((deal) => deal.id !== active.id));

      setActive(null);

      toast.success("Deal deleted from demo data");
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
    [stage, setStage, ["All stages", ...stages]],
    [
      probability,
      setProbability,
      ["All probabilities", "0-25%", "26-50%", "51-75%", "76-99%", "100%"],
    ],
    [
      company,
      setCompany,
      ["All companies", "CloudAxis", "Vertex Labs", "Vexui Systems", "BrightWorks", "Acme Inc."],
    ],
    [owner, setOwner, ["All owners", ...owners]],
    [
      value,
      setValue,
      ["All values", "Under $10K", "$10K-$50K", "$50K-$100K", "$100K-$250K", "$250K+"],
    ],
    [
      close,
      setClose,
      [
        "Any close",
        "This Week",
        "This Month",
        "Next Month",
        "This Quarter",
        "Overdue",
        "No Close Date",
      ],
    ],
    [
      source,
      setSource,
      [
        "All sources",
        "Inbound",
        "Referral",
        "LinkedIn",
        "Event",
        "Partner",
        "Outbound",
        "Existing Customer",
      ],
    ],
    [
      tag,
      setTag,
      ["All tags", "Enterprise", "Expansion", "Renewal", "Strategic", "Upsell", "Cross-sell"],
    ],
    [
      sort,
      setSort,
      [
        "Recently Created",
        "Recently Updated",
        "Highest Value",
        "Lowest Value",
        "Highest Probability",
        "Expected Close Date",
        "Company A-Z",
        "Deal Name A-Z",
      ],
    ],
  ];

  return (
    <>
      <PageHeader
        title="Deals"
        subtitle="Manage opportunities, forecast revenue and move deals through your sales pipeline."
        breadcrumb={["Vexui", "CRM", "Deals"]}
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
              <Icons.Plus />
              Add deal
            </Button>
          </>
        }
      />

      {/* Summary */}

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Deals", "1,284"],
            ["Open", "846"],
            ["Won", "284"],
            ["Lost", "154"],
            ["Open Pipeline", "$8.42M"],
            ["Weighted Pipeline", "$5.16M"],
          ].map(([label, amount]) => (
            <div key={label} className="min-w-[130px] flex-1 px-5 py-3">
              <small className="text-muted-foreground">{label}</small>
              <b className="block text-lg">{amount}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        {/* Search & Filters */}

        <div className="border-b p-4">
          <label className="relative mb-3 block max-w-md">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search deal, company, contact or tag"
              className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map(([filterValue, setter, options], index) => (
              <select
                key={index}
                value={filterValue as string}
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
          <div className="flex flex-wrap gap-2 border-b bg-primary/5 px-4 py-2">
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
                setBulk("Proposal");
                setModal("bulkStage");
              }}
            >
              Change stage
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
                setDeals((current) =>
                  current.map((deal) =>
                    selected.includes(deal.id) ? { ...deal, stage: "Archived" } : deal,
                  ),
                );

                toast.success("Selected deals archived");
              }}
            >
              Archive
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportCsv(deals.filter((deal) => selected.includes(deal.id)))}
            >
              Export
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setModal("bulkDelete")}>
              Delete
            </Button>
          </div>
        )}

        {/* Deals Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1130px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all deals"
                    checked={all}
                    onChange={() => setSelected(all ? [] : filtered.map((deal) => deal.id))}
                  />
                </th>

                {[
                  "Deal",
                  "Company",
                  "Contact",
                  "Stage",
                  "Probability",
                  "Value",
                  "Weighted",
                  "Owner",
                  "Expected close",
                  "Next activity",
                  "",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${deal.name}`}
                      checked={selected.includes(deal.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(deal.id)
                            ? current.filter((id) => id !== deal.id)
                            : [...current, deal.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button onClick={() => setActive(deal)} className="text-start">
                      <b className="block hover:text-primary">{deal.name}</b>
                      <small className="text-muted-foreground">DEAL-{deal.id}</small>
                    </button>
                  </td>

                  <td className="px-3 py-4">{deal.company}</td>

                  <td className="px-3 py-4">
                    <b>{deal.contact}</b>
                    <small className="block text-muted-foreground">{deal.role}</small>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={tone[deal.stage]}>{deal.stage}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <b>{deal.prob}%</b>

                    <div className="mt-1 h-1.5 w-16 rounded bg-muted">
                      <div
                        className="h-full rounded bg-primary"
                        style={{ width: `${deal.prob}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-3 py-4 font-semibold">
                    ${(deal.value / 1000).toFixed(deal.value % 1000 ? 1 : 0)}K
                  </td>

                  <td className="px-3 py-4">${((deal.value * deal.prob) / 100000).toFixed(1)}K</td>

                  <td className="px-3 py-4">{deal.owner}</td>
                  <td className="px-3 py-4">{deal.close}</td>

                  <td className="px-3 py-4">
                    <p>{deal.next}</p>
                    <small className="text-muted-foreground">{deal.activity}</small>
                  </td>

                  <td className="px-3 py-4">
                    <Button size="sm" variant="outline" onClick={() => setActive(deal)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="grid place-items-center gap-2 p-12">
            <Icons.Handshake className="size-8 text-muted-foreground" />
            <b>No matching deals</b>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}

        <div className="flex justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing 1-{filtered.length} of 1,284 deals</span>
          <span>20 per page</span>
        </div>
      </Card>

      {/* Deal Details */}

      <Sheet open={Boolean(active) && !modal} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{active?.name}</SheetTitle>
            <SheetDescription>
              {active?.company} {active?.contact}
            </SheetDescription>
          </SheetHeader>

          {active && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["Stage", active.stage],
                  ["Probability", `${active.prob}%`],
                  ["Value", `$${active.value.toLocaleString()}`],
                  ["Weighted", `$${((active.value * active.prob) / 100).toLocaleString()}`],
                  ["Owner", active.owner],
                  ["Expected close", active.close],
                ].map(([label, amount]) => (
                  <div key={label} className="rounded-lg border p-3">
                    <small className="text-muted-foreground">{label}</small>
                    <b className="mt-1 block text-sm">{amount}</b>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="mb-2 font-semibold">Pipeline progress</h3>

                <div className="flex gap-1">
                  {[
                    "Qualification",
                    "Discovery",
                    "Proposal",
                    "Negotiation",
                    "Contract",
                    "Closed Won",
                  ].map((item) => (
                    <span
                      key={item}
                      title={item}
                      className={`h-2 flex-1 rounded ${
                        item === active.stage ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">Current stage: {active.stage}</p>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">Products & services</h3>

                {[
                  ["Enterprise Platform", "$52K"],
                  ["Implementation", "$18K"],
                  ["Support Package", "$14.5K"],
                ].map(([name, amount]) => (
                  <div key={name} className="flex justify-between border-b py-2 text-sm">
                    <span>{name}</span>
                    <b>{amount}</b>
                  </div>
                ))}
              </section>

              <section>
                <div className="mb-2 flex justify-between">
                  <h3 className="font-semibold">Activity, notes & tasks</h3>

                  <span>
                    <Button size="sm" variant="ghost" onClick={() => setModal("note")}>
                      Note
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => setModal("task")}>
                      Task
                    </Button>
                  </span>
                </div>

                <p className="rounded-lg border p-3 text-sm">{active.activity} Recently</p>

                {active.notes.map((note, index) => (
                  <p key={index} className="mt-2 rounded-lg border p-3 text-sm">
                    {note}
                  </p>
                ))}

                {active.tasks.map((task, index) => (
                  <p key={index} className="mt-2 rounded-lg border p-3 text-sm">
                    {task}
                  </p>
                ))}
              </section>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => editDeal(active)}>
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setBulk(active.owner);
                    setModal("owner");
                  }}
                >
                  Assign owner
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setBulk(active.stage);
                    setModal("stage");
                  }}
                >
                  Change stage
                </Button>

                <Button variant="outline" onClick={() => setModal("activity")}>
                  Log activity
                </Button>

                <Button onClick={() => setModal("won")} disabled={active.stage === "Closed Won"}>
                  Mark won
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setModal("lost")}
                  disabled={active.stage === "Closed Lost"}
                >
                  Mark lost
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setDeals((current) => [
                      ...current,
                      {
                        ...active,
                        id: Date.now(),
                        name: `${active.name} (Copy)`,
                        stage: "Qualification",
                        prob: 10,
                      },
                    ]);

                    toast.success("Deal duplicated");
                  }}
                >
                  Duplicate
                </Button>

                <Button variant="destructive" onClick={() => setModal("delete")}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Action Dialog */}

      <Dialog open={Boolean(modal)} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Deal"
                : modal === "edit"
                  ? "Edit Deal"
                  : modal === "note"
                    ? "Add Deal Note"
                    : modal === "task"
                      ? "Create Deal Task"
                      : modal === "activity"
                        ? "Log Activity"
                        : modal === "owner" || modal === "bulkOwner"
                          ? "Assign Deal Owner"
                          : modal === "stage" || modal === "bulkStage"
                            ? "Change Deal Stage"
                            : modal === "won"
                              ? "Mark Deal as Won"
                              : modal === "lost"
                                ? "Mark Deal as Lost"
                                : modal === "archive"
                                  ? "Archive this deal?"
                                  : modal === "delete"
                                    ? "Delete this deal?"
                                    : modal === "bulkTag"
                                      ? "Add tag to selected deals"
                                      : "Delete selected deals?"}
            </DialogTitle>

            <DialogDescription>
              {modal === "won"
                ? `Confirm final value for ${active?.name} and create onboarding task if required.`
                : modal === "lost"
                  ? "Record a loss reason before closing this opportunity."
                  : modal === "delete" || modal === "bulkDelete"
                    ? "This demo action only removes local deal data."
                    : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {(modal === "add" || modal === "edit") && <Form f={form} setF={setForm} />}

          {["note", "task", "activity", "lost"].includes(modal ?? "") && (
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={
                modal === "lost" ? "Lost reason: Budget, Competitor, Timing..." : "Enter details"
              }
              className="h-10 w-full rounded-md border bg-background px-3"
            />
          )}

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

          {["stage", "bulkStage"].includes(modal ?? "") && (
            <select
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {stages.slice(0, 5).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          )}

          {modal === "bulkTag" && (
            <input
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              placeholder="Tag"
              className="h-10 rounded-md border bg-background px-3"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>

            <Button
              variant={modal === "delete" || modal === "bulkDelete" ? "destructive" : "default"}
              onClick={modal === "add" || modal === "edit" ? saveDeal : confirmAction}
            >
              {modal === "add"
                ? "Create Deal"
                : modal === "edit"
                  ? "Save Changes"
                  : modal === "won"
                    ? "Mark Won"
                    : modal === "lost"
                      ? "Mark Lost"
                      : modal === "delete" || modal === "bulkDelete"
                        ? "Delete"
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
