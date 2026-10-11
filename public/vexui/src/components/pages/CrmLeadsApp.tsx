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

type Stage =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Nurturing"
  | "Proposal"
  | "Negotiation"
  | "Converted"
  | "Disqualified"
  | "Archived";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  score: number;
  stage: Stage;
  source: string;
  owner: string;
  value: number;
  probability: number;
  follow: string;
  followKind: string;
  activity: string;
  days: number;
  tags: string[];
  notes: string[];
  tasks: string[];
  initials: string;
};

type Modal =
  | "add"
  | "edit"
  | "note"
  | "task"
  | "owner"
  | "stage"
  | "convert"
  | "disqualify"
  | "archive"
  | "delete"
  | "bulkOwner"
  | "bulkStage"
  | "bulkTag"
  | "bulkDelete"
  | null;

const owners = ["Sophia Carter", "Daniel Lee", "Olivia Smith", "Emma Wilson"];

const stages: Stage[] = [
  "New",
  "Contacted",
  "Qualified",
  "Nurturing",
  "Proposal",
  "Negotiation",
  "Converted",
  "Disqualified",
  "Archived",
];

const seed: Lead[] = [
  {
    id: 1,
    name: "Ava Thompson",
    email: "ava@cloudaxis.com",
    phone: "+1 212 555 0171",
    role: "VP Operations",
    company: "CloudAxis",
    score: 86,
    stage: "Qualified",
    source: "LinkedIn",
    owner: "Sophia Carter",
    value: 84500,
    probability: 76,
    follow: "Aug 26",
    followKind: "This Week",
    activity: "Pricing email opened",
    days: 0,
    tags: ["Enterprise", "High Intent", "Decision Maker"],
    notes: ["Demo completed; operations team is aligned."],
    tasks: ["Send proposal"],
    initials: "AT",
  },
  {
    id: 2,
    name: "Liam Brooks",
    email: "liam@vertexlabs.com",
    phone: "+44 20 7946 0281",
    role: "CTO",
    company: "Vertex Labs",
    score: 74,
    stage: "Nurturing",
    source: "Referral",
    owner: "Daniel Lee",
    value: 42000,
    probability: 52,
    follow: "Aug 28",
    followKind: "This Week",
    activity: "Call completed",
    days: 1,
    tags: ["Technical Buyer", "Demo Requested"],
    notes: ["Security review requested."],
    tasks: ["Share architecture pack"],
    initials: "LB",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@vexuisystems.com",
    phone: "+1 416 555 0132",
    role: "Head of Marketing",
    company: "Vexui Systems",
    score: 91,
    stage: "Proposal",
    source: "Event",
    owner: "Olivia Smith",
    value: 128000,
    probability: 82,
    follow: "Today",
    followKind: "Today",
    activity: "Demo completed",
    days: 2,
    tags: ["Enterprise", "Pricing"],
    notes: ["Proposal sent after event meeting."],
    tasks: ["Confirm stakeholder review"],
    initials: "ED",
  },
  {
    id: 4,
    name: "Noah Walker",
    email: "noah@brightworks.com",
    phone: "+49 30 901824",
    role: "Procurement Manager",
    company: "BrightWorks",
    score: 62,
    stage: "Contacted",
    source: "Website",
    owner: "Emma Wilson",
    value: 18000,
    probability: 38,
    follow: "Tomorrow",
    followKind: "Tomorrow",
    activity: "Website form submitted",
    days: 4,
    tags: ["High Intent"],
    notes: [],
    tasks: ["Qualify needs"],
    initials: "NW",
  },
  {
    id: 5,
    name: "Mia Patel",
    email: "mia@acmeinc.com",
    phone: "+91 40 5550 0191",
    role: "Director of Finance",
    company: "Acme Inc.",
    score: 39,
    stage: "New",
    source: "Paid Ads",
    owner: "Sophia Carter",
    value: 8000,
    probability: 15,
    follow: "Overdue",
    followKind: "Overdue",
    activity: "Lead created",
    days: 18,
    tags: ["Pricing"],
    notes: ["Requested pricing overview."],
    tasks: ["Make first contact"],
    initials: "MP",
  },
];

const tone: Record<Stage, "primary" | "info" | "success" | "warning" | "danger" | "muted"> = {
  New: "primary",
  Contacted: "info",
  Qualified: "success",
  Nurturing: "info",
  Proposal: "warning",
  Negotiation: "warning",
  Converted: "success",
  Disqualified: "danger",
  Archived: "muted",
};

const blank = {
  first: "",
  last: "",
  email: "",
  phone: "",
  role: "",
  company: "CloudAxis",
  stage: "New" as Stage,
  source: "Website",
  owner: "Sophia Carter",
  score: "50",
  value: "0",
  probability: "50",
  follow: "Aug 30",
  tags: "",
  notes: "",
};

function LeadForm({
  form,
  setForm,
}: {
  form: typeof blank;
  setForm: (value: typeof blank) => void;
}) {
  const field = (key: keyof typeof blank, label: string) => (
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
        className="h-10 rounded-md border bg-background px-3"
      />
    </label>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {field("first", "First name")}
      {field("last", "Last name")}
      {field("email", "Email")}
      {field("phone", "Phone")}
      {field("role", "Job title")}

      <label className="grid gap-1 text-sm">
        <b>Company</b>
        <select
          value={form.company}
          onChange={(event) =>
            setForm({
              ...form,
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

      <label className="grid gap-1 text-sm">
        <b>Stage</b>
        <select
          value={form.stage}
          onChange={(event) =>
            setForm({
              ...form,
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

      <label className="grid gap-1 text-sm">
        <b>Source</b>
        <select
          value={form.source}
          onChange={(event) =>
            setForm({
              ...form,
              source: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {[
            "Website",
            "LinkedIn",
            "Referral",
            "Email Campaign",
            "Event",
            "Partner",
            "Paid Ads",
            "Manual Entry",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <b>Owner</b>
        <select
          value={form.owner}
          onChange={(event) =>
            setForm({
              ...form,
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

      {field("score", "Lead score")}
      {field("value", "Potential value")}
      {field("probability", "Probability %")}
      {field("follow", "Next follow-up")}
      {field("tags", "Tags (comma separated)")}

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

export function CrmLeadsApp() {
  const [leads, setLeads] = useState(seed);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All stages");
  const [score, setScore] = useState("All scores");
  const [source, setSource] = useState("All sources");
  const [company, setCompany] = useState("All companies");
  const [owner, setOwner] = useState("All owners");
  const [value, setValue] = useState("All values");
  const [follow, setFollow] = useState("Any follow-up");
  const [tag, setTag] = useState("All tags");
  const [sort, setSort] = useState("Recently Added");

  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<Lead | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState(blank);
  const [text, setText] = useState("");
  const [bulk, setBulk] = useState("Sophia Carter");
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          !query ||
          [lead.name, lead.email, lead.phone, lead.company, lead.role, lead.source, ...lead.tags]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());

        const matchesScore =
          score === "All scores" ||
          (score === "Hot: 80-100" && lead.score >= 80) ||
          (score === "Warm: 50-79" && lead.score >= 50 && lead.score < 80) ||
          (score === "Cold: 0-49" && lead.score < 50);

        const matchesValue =
          value === "All values" ||
          (value === "Under $10K" && lead.value < 10_000) ||
          (value === "$10K-$50K" && lead.value >= 10_000 && lead.value <= 50_000) ||
          (value === "$50K-$100K" && lead.value > 50_000 && lead.value <= 100_000) ||
          (value === "$100K+" && lead.value > 100_000);

        return (
          matchesSearch &&
          (stage === "All stages" || lead.stage === stage) &&
          matchesScore &&
          (source === "All sources" || lead.source === source) &&
          (company === "All companies" || lead.company === company) &&
          (owner === "All owners" || lead.owner === owner) &&
          matchesValue &&
          (follow === "Any follow-up" || lead.followKind === follow) &&
          (tag === "All tags" || lead.tags.includes(tag))
        );
      })
      .sort((a, b) => {
        if (sort === "Highest Score") return b.score - a.score;
        if (sort === "Lowest Score") return a.score - b.score;
        if (sort === "Highest Value") return b.value - a.value;
        if (sort === "Next Follow-up") return a.follow.localeCompare(b.follow);
        if (sort === "Company A-Z") return a.company.localeCompare(b.company);
        if (sort === "Lead Name A-Z") return a.name.localeCompare(b.name);

        return b.id - a.id;
      });
  }, [leads, query, stage, score, source, company, owner, value, follow, tag, sort]);

  const visible = filtered.slice(0, pageSize);

  const all = visible.length > 0 && visible.every((lead) => selected.includes(lead.id));

  const updateLead = (id: number, patch: Partial<Lead>, message: string) => {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));

    setActive((lead) => (lead?.id === id ? { ...lead, ...patch } : lead));

    toast.success(message);
  };

  const resetFilters = () => {
    setQuery("");
    setStage("All stages");
    setScore("All scores");
    setSource("All sources");
    setCompany("All companies");
    setOwner("All owners");
    setValue("All values");
    setFollow("Any follow-up");
    setTag("All tags");
    setSort("Recently Added");
  };

  const exportCsv = (rows = filtered) => {
    const csv = [
      "Lead,Company,Score,Stage,Value,Owner",
      ...rows.map((lead) =>
        [lead.name, lead.company, lead.score, lead.stage, lead.value, lead.owner].join(","),
      ),
    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    link.download = "crm-leads.csv";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Leads export downloaded");
  };

  const editLead = (lead: Lead) => {
    setActive(lead);

    const name = lead.name.split(" ");

    setForm({
      first: name[0],
      last: name.slice(1).join(" "),
      email: lead.email,
      phone: lead.phone,
      role: lead.role,
      company: lead.company,
      stage: lead.stage,
      source: lead.source,
      owner: lead.owner,
      score: String(lead.score),
      value: String(lead.value),
      probability: String(lead.probability),
      follow: lead.follow,
      tags: lead.tags.join(", "),
      notes: lead.notes.join(" "),
    });

    setModal("edit");
  };

  const saveLead = () => {
    const valid =
      form.first &&
      form.last &&
      (!form.email || /^\S+@\S+\.\S+$/.test(form.email)) &&
      Number(form.score) >= 0 &&
      Number(form.score) <= 100 &&
      Number(form.probability) >= 0 &&
      Number(form.probability) <= 100 &&
      Number(form.value) >= 0;

    if (!valid) {
      toast.error("Check required fields, email, score, value and probability");
      return;
    }

    const patch = {
      name: `${form.first} ${form.last}`,
      email: form.email,
      phone: form.phone,
      role: form.role,
      company: form.company,
      stage: form.stage,
      source: form.source,
      owner: form.owner,
      score: Number(form.score),
      value: Number(form.value),
      probability: Number(form.probability),
      follow: form.follow,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: form.notes ? [form.notes] : [],
    };

    if (modal === "add") {
      setLeads((current) => [
        ...current,
        {
          ...patch,
          id: Date.now(),
          followKind: "This Week",
          activity: "Lead created",
          days: 0,
          tasks: [],
          initials: `${form.first[0]}${form.last[0]}`.toUpperCase(),
        },
      ]);

      toast.success("Lead created");
    } else if (active) {
      updateLead(active.id, patch, "Lead updated");
    }

    setModal(null);
  };

  const confirmAction = () => {
    if (modal === "bulkOwner") {
      setLeads((current) =>
        current.map((lead) => (selected.includes(lead.id) ? { ...lead, owner: bulk } : lead)),
      );
    } else if (modal === "bulkStage") {
      setLeads((current) =>
        current.map((lead) =>
          selected.includes(lead.id) ? { ...lead, stage: bulk as Stage } : lead,
        ),
      );
    } else if (modal === "bulkTag") {
      setLeads((current) =>
        current.map((lead) =>
          selected.includes(lead.id) ? { ...lead, tags: [...lead.tags, bulk] } : lead,
        ),
      );
    } else if (modal === "bulkDelete") {
      setLeads((current) => current.filter((lead) => !selected.includes(lead.id)));
      setSelected([]);
    } else if (active && modal === "note" && text) {
      updateLead(active.id, { notes: [...active.notes, text] }, "Note added");
    } else if (active && modal === "task" && text) {
      updateLead(active.id, { tasks: [...active.tasks, text] }, "Follow-up task created");
    } else if (active && modal === "owner") {
      updateLead(active.id, { owner: bulk }, "Lead owner assigned");
    } else if (active && modal === "stage") {
      updateLead(active.id, { stage: bulk as Stage }, "Lead stage updated");
    } else if (active && modal === "convert") {
      updateLead(active.id, { stage: "Converted" }, "Lead converted and related deal created");
    } else if (active && modal === "disqualify") {
      updateLead(active.id, { stage: "Disqualified" }, "Lead disqualified");
    } else if (active && modal === "archive") {
      updateLead(active.id, { stage: "Archived" }, "Lead archived");
    } else if (active && modal === "delete") {
      setLeads((current) => current.filter((lead) => lead.id !== active.id));
      setActive(null);
      toast.success("Lead deleted from demo data");
    } else {
      return;
    }

    if (modal?.startsWith("bulk")) {
      toast.success("Bulk action completed");
    }

    setModal(null);
    setText("");
  };

  const filters = [
    [stage, setStage, ["All stages", ...stages]],
    [score, setScore, ["All scores", "Hot: 80-100", "Warm: 50-79", "Cold: 0-49"]],
    [
      source,
      setSource,
      [
        "All sources",
        "Website",
        "LinkedIn",
        "Referral",
        "Email Campaign",
        "Event",
        "Partner",
        "Paid Ads",
        "Manual Entry",
      ],
    ],
    [
      company,
      setCompany,
      ["All companies", "CloudAxis", "Vertex Labs", "Vexui Systems", "BrightWorks", "Acme Inc."],
    ],
    [owner, setOwner, ["All owners", ...owners]],
    [value, setValue, ["All values", "Under $10K", "$10K-$50K", "$50K-$100K", "$100K+"]],
    [
      follow,
      setFollow,
      ["Any follow-up", "Today", "Tomorrow", "This Week", "Overdue", "No Follow-up"],
    ],
    [
      tag,
      setTag,
      [
        "All tags",
        "Enterprise",
        "High Intent",
        "Demo Requested",
        "Pricing",
        "Renewal",
        "Decision Maker",
        "Technical Buyer",
      ],
    ],
    [
      sort,
      setSort,
      [
        "Recently Added",
        "Recently Updated",
        "Highest Score",
        "Lowest Score",
        "Highest Value",
        "Next Follow-up",
        "Company A-Z",
        "Lead Name A-Z",
      ],
    ],
  ];

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Track prospects, prioritize opportunities and move qualified leads through the pipeline."
        breadcrumb={["Vexui", "CRM", "Leads"]}
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
              <Icons.UserPlus />
              Add lead
            </Button>
          </>
        }
      />

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Leads", "4,862"],
            ["New", "684"],
            ["Qualified", "1,248"],
            ["In Nurture", "942"],
            ["Hot Leads", "318"],
            ["Potential Value", "$3.84M"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[130px] flex-1 px-5 py-3">
              <small className="text-muted-foreground">{label}</small>
              <b className="block text-lg">{value}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="border-b p-4">
          <label className="relative mb-3 block max-w-md">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lead, company, title or tag"
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

            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </div>

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
                setBulk("Qualified");
                setModal("bulkStage");
              }}
            >
              Change stage
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulk("High Intent");
                setModal("bulkTag");
              }}
            >
              Add tag
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setLeads((current) =>
                  current.map((lead) =>
                    selected.includes(lead.id) ? { ...lead, stage: "Archived" } : lead,
                  ),
                );

                toast.success("Selected leads archived");
              }}
            >
              Archive
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportCsv(leads.filter((lead) => selected.includes(lead.id)))}
            >
              Export
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setModal("bulkDelete")}>
              Delete
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    aria-label="Select all visible leads"
                    type="checkbox"
                    checked={all}
                    onChange={() => setSelected(all ? [] : visible.map((lead) => lead.id))}
                  />
                </th>

                {[
                  "Lead",
                  "Company",
                  "Score",
                  "Stage",
                  "Source",
                  "Owner",
                  "Potential value",
                  "Next follow-up",
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
              {visible.map((lead) => (
                <tr key={lead.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      aria-label={`Select ${lead.name}`}
                      type="checkbox"
                      checked={selected.includes(lead.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(lead.id)
                            ? current.filter((id) => id !== lead.id)
                            : [...current, lead.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(lead)}
                      className="flex gap-2 text-start"
                    >
                      <img
                        src={getUserImage(lead.name)}
                        alt={lead.name}
                        className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary object-cover"
                      />

                      <span>
                        <b className="block hover:text-primary">{lead.name}</b>
                        <small className="text-muted-foreground">
                          {lead.email} {lead.role}
                        </small>
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-4">{lead.company}</td>

                  <td className="px-3 py-4">
                    <b>{lead.score}</b>
                    <small className="ms-1 text-muted-foreground">
                      {lead.score >= 80 ? "Hot" : lead.score >= 50 ? "Warm" : "Cold"}
                    </small>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={tone[lead.stage]}>{lead.stage}</Badge>
                  </td>

                  <td className="px-3 py-4 text-muted-foreground">{lead.source}</td>

                  <td className="px-3 py-4">{lead.owner}</td>

                  <td className="px-3 py-4">
                    <b>${(lead.value / 1000).toFixed(lead.value % 1000 ? 1 : 0)}K</b>
                    <small className="block text-muted-foreground">
                      {lead.probability}% probability
                    </small>
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={
                        lead.followKind === "Overdue" ? "font-medium text-destructive" : ""
                      }
                    >
                      {lead.follow}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <p>{lead.days === 0 ? "2 hours ago" : `${lead.days} days ago`}</p>
                    <small className="text-muted-foreground">{lead.activity}</small>
                  </td>

                  <td className="px-3 py-4">
                    <Button size="sm" variant="outline" onClick={() => setActive(lead)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!visible.length && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Icons.UserRoundSearch className="size-8 text-muted-foreground" />
            <b>No matching leads</b>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        <div className="flex justify-between flex-wrap gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing 1-{visible.length} of 4,862 leads</span>

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

      <Sheet open={Boolean(active) && !modal} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{active?.name}</SheetTitle>
            <SheetDescription>
              {active?.role} {active?.company}
            </SheetDescription>
          </SheetHeader>

          {active && (
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <img
                  src={getUserImage(active.name)}
                  alt={active.name}
                  className="grid size-12 place-items-center rounded-full bg-primary/10 font-semibold text-primary object-cover"
                />

                <div>
                  <b>{active.name}</b>
                  <p className="text-sm text-muted-foreground">
                    {active.email} {active.phone}
                  </p>

                  <div className="mt-1 flex gap-1">
                    <Badge tone={tone[active.stage]}>{active.stage}</Badge>

                    {active.tags.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  [
                    "Score",
                    `${active.score} / ${
                      active.score >= 80 ? "Hot" : active.score >= 50 ? "Warm" : "Cold"
                    }`,
                  ],
                  ["Owner", active.owner],
                  ["Source", active.source],
                  ["Potential value", `$${(active.value / 1000).toFixed(1)}K`],
                  ["Probability", `${active.probability}%`],
                  ["Next follow-up", active.follow],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border p-3">
                    <small className="text-muted-foreground">{label}</small>
                    <b className="mt-1 block text-sm">{value}</b>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="mb-2 font-semibold">Qualification</h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Budget", "Confirmed"],
                    ["Authority", "Decision maker"],
                    ["Need", "High"],
                    ["Timeline", "This quarter"],
                  ].map(([label, value]) => (
                    <p key={label} className="rounded-lg border p-3 text-sm">
                      <b>{label}</b>
                      <small className="block text-muted-foreground">{value}</small>
                    </p>
                  ))}
                </div>
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
                <Button variant="outline" onClick={() => editLead(active)}>
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

                <Button onClick={() => setModal("convert")} disabled={active.stage === "Converted"}>
                  Convert lead
                </Button>

                <Button variant="outline" onClick={() => setModal("disqualify")}>
                  Disqualify
                </Button>

                <Button variant="outline" onClick={() => setModal("archive")}>
                  Archive
                </Button>

                <Button
                  variant="destructive"
                  className="col-span-2"
                  onClick={() => setModal("delete")}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(modal)} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Lead"
                : modal === "edit"
                  ? "Edit Lead"
                  : modal === "note"
                    ? "Add Lead Note"
                    : modal === "task"
                      ? "Create Follow-up Task"
                      : modal === "owner" || modal === "bulkOwner"
                        ? "Assign Lead Owner"
                        : modal === "stage" || modal === "bulkStage"
                          ? "Change Lead Stage"
                          : modal === "convert"
                            ? "Convert Lead"
                            : modal === "disqualify"
                              ? "Disqualify Lead"
                              : modal === "archive"
                                ? "Archive this lead?"
                                : modal === "delete"
                                  ? "Delete this lead?"
                                  : modal === "bulkTag"
                                    ? "Add tag to selected leads"
                                    : "Delete selected leads?"}
            </DialogTitle>

            <DialogDescription>
              {modal === "convert"
                ? `Convert ${active?.name} and create the related contact, company and deal in this demo flow.`
                : modal === "disqualify"
                  ? "Select a reason before disqualifying this lead."
                  : modal === "delete" || modal === "bulkDelete"
                    ? "This is demo behavior and removes leads only from local data."
                    : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {(modal === "add" || modal === "edit") && <LeadForm form={form} setForm={setForm} />}

          {["note", "task", "disqualify"].includes(modal ?? "") && (
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={
                modal === "note"
                  ? "Write an internal note"
                  : modal === "task"
                    ? "Task title"
                    : "Reason: No Budget, Wrong Fit, No Response..."
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
              {stages.slice(0, 6).map((item) => (
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

          {modal === "convert" && (
            <div className="rounded-lg border bg-muted/20 p-3 text-sm">
              <b>Create Deal: {active?.company} opportunity</b>
              <p className="mt-1 text-muted-foreground">
                Value ${active?.value.toLocaleString()} {active?.probability}% probability
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>

            <Button
              variant={modal === "delete" || modal === "bulkDelete" ? "destructive" : "default"}
              onClick={modal === "add" || modal === "edit" ? saveLead : confirmAction}
            >
              {modal === "add"
                ? "Create Lead"
                : modal === "edit"
                  ? "Save Changes"
                  : modal === "convert"
                    ? "Convert Lead"
                    : modal === "disqualify"
                      ? "Disqualify"
                      : modal === "archive"
                        ? "Archive"
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
