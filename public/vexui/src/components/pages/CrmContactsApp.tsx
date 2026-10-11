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

type Type = "Lead" | "Customer" | "Partner" | "Vendor" | "Prospect";

type Status = "Active" | "New" | "Qualified" | "Nurturing" | "Inactive" | "Archived";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  industry: string;
  owner: string;
  source: string;
  type: Type;
  status: Status;
  tags: string[];
  score: number;
  pipeline: number;
  activity: string;
  activityDays: number | null;
  followUp: string;
  overdue: boolean;
  notes: string[];
  tasks: string[];
  initials: string;
  location: string;
};

type Modal =
  | "add"
  | "edit"
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

const seed: Contact[] = [
  {
    id: 1,
    name: "Ava Thompson",
    email: "ava@cloudaxis.com",
    phone: "+1 212 555 0171",
    role: "VP Operations",
    company: "CloudAxis",
    industry: "SaaS",
    owner: "Sophia Carter",
    source: "LinkedIn",
    type: "Lead",
    status: "Qualified",
    tags: ["Enterprise", "Decision Maker", "High Intent"],
    score: 86,
    pipeline: 84500,
    activity: "Email opened",
    activityDays: 0,
    followUp: "Aug 26",
    overdue: false,
    notes: ["Demo completed with operations team.", "Interested in enterprise rollout."],
    tasks: ["Send proposal", "Schedule technical review"],
    initials: "AT",
    location: "New York, US",
  },
  {
    id: 2,
    name: "Liam Brooks",
    email: "liam@vertexlabs.com",
    phone: "+44 20 7946 0281",
    role: "CTO",
    company: "Vertex Labs",
    industry: "Technology",
    owner: "Daniel Lee",
    source: "Referral",
    type: "Prospect",
    status: "Nurturing",
    tags: ["Technical Buyer", "Demo Requested"],
    score: 74,
    pipeline: 42000,
    activity: "Call completed",
    activityDays: 1,
    followUp: "Aug 28",
    overdue: false,
    notes: ["Needs security documentation before approval."],
    tasks: ["Share security pack"],
    initials: "LB",
    location: "London, UK",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@vexuisystems.com",
    phone: "+1 416 555 0132",
    role: "Head of Marketing",
    company: "Vexui Systems",
    industry: "Software",
    owner: "Olivia Smith",
    source: "Event",
    type: "Customer",
    status: "Active",
    tags: ["VIP", "Renewal", "Decision Maker"],
    score: 91,
    pipeline: 128000,
    activity: "Deal moved to Proposal",
    activityDays: 2,
    followUp: "Today",
    overdue: false,
    notes: ["Renewal expansion opportunity confirmed."],
    tasks: ["Review renewal forecast", "Send Q4 roadmap"],
    initials: "ED",
    location: "Toronto, Canada",
  },
  {
    id: 4,
    name: "Noah Walker",
    email: "noah@brightworks.com",
    phone: "+49 30 901824",
    role: "Procurement Manager",
    company: "BrightWorks",
    industry: "Manufacturing",
    owner: "Emma Wilson",
    source: "Website",
    type: "Lead",
    status: "New",
    tags: ["High Intent"],
    score: 62,
    pipeline: 18000,
    activity: "Form submitted",
    activityDays: 4,
    followUp: "Aug 25",
    overdue: false,
    notes: [],
    tasks: ["Qualify requirements"],
    initials: "NW",
    location: "Berlin, Germany",
  },
  {
    id: 5,
    name: "Mia Patel",
    email: "mia@acmeinc.com",
    phone: "+91 40 5550 0191",
    role: "Director of Finance",
    company: "Acme Inc.",
    industry: "Finance",
    owner: "Sophia Carter",
    source: "Email Campaign",
    type: "Prospect",
    status: "Inactive",
    tags: ["Enterprise", "Renewal"],
    score: 43,
    pipeline: 56000,
    activity: "No activity",
    activityDays: 45,
    followUp: "Overdue",
    overdue: true,
    notes: ["Paused due to budget cycle."],
    tasks: ["Re-engage after budget review"],
    initials: "MP",
    location: "Hyderabad, India",
  },
];

const statusTone: Record<Status, "success" | "primary" | "info" | "warning" | "muted"> = {
  Active: "success",
  New: "primary",
  Qualified: "success",
  Nurturing: "info",
  Inactive: "warning",
  Archived: "muted",
};

const blank = {
  first: "",
  last: "",
  email: "",
  phone: "",
  role: "",
  company: "CloudAxis",
  type: "Lead" as Type,
  status: "New" as Status,
  owner: "Sophia Carter",
  source: "Website",
  score: "50",
  tags: "",
  followUp: "Aug 30",
  notes: "",
};

/* =====================================================
   Contact Form
===================================================== */

function ContactForm({
  form,
  setForm,
}: {
  form: typeof blank;
  setForm: (value: typeof blank) => void;
}) {
  const text = (key: keyof typeof blank, label: string) => (
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

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {text("first", "First name")}
      {text("last", "Last name")}
      {text("email", "Email")}
      {text("phone", "Phone")}
      {text("role", "Job title")}

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
          {["Acme Inc.", "Vertex Labs", "Vexui Systems", "CloudAxis", "BrightWorks"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <b>Contact type</b>

        <select
          value={form.type}
          onChange={(event) =>
            setForm({
              ...form,
              type: event.target.value as Type,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {(["Lead", "Customer", "Partner", "Vendor", "Prospect"] as Type[]).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <b>Status</b>

        <select
          value={form.status}
          onChange={(event) =>
            setForm({
              ...form,
              status: event.target.value as Status,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {(["Active", "New", "Qualified", "Nurturing", "Inactive", "Archived"] as Status[]).map(
            (item) => (
              <option key={item}>{item}</option>
            ),
          )}
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
            "Referral",
            "LinkedIn",
            "Email Campaign",
            "Event",
            "Partner",
            "Manual Entry",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      {text("score", "Lead score")}
      {text("tags", "Tags (comma separated)")}
      {text("followUp", "Next follow-up")}

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
          className="rounded-md border bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </div>
  );
}

/* =====================================================
   CRM Contacts App
===================================================== */

export function CrmContactsApp() {
  const [contacts, setContacts] = useState(seed);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All statuses");
  const [company, setCompany] = useState("All companies");
  const [owner, setOwner] = useState("All owners");
  const [source, setSource] = useState("All sources");
  const [tag, setTag] = useState("All tags");
  const [activity, setActivity] = useState("Any activity");
  const [sort, setSort] = useState("Recently Added");

  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<Contact | null>(null);
  const [modal, setModal] = useState<Modal>(null);

  const [form, setForm] = useState(blank);
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [bulk, setBulk] = useState("Sophia Carter");

  const [pageSize, setPageSize] = useState(20);

  /* ===================================================
     Filter & Sort Contacts
  =================================================== */

  const filtered = useMemo(() => {
    return contacts
      .filter((contact) => {
        const search = query.toLowerCase();

        const matchesSearch =
          !search ||
          [
            contact.name,
            contact.email,
            contact.phone,
            contact.company,
            contact.role,
            ...contact.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search);

        const matchesActivity =
          activity === "Any activity" ||
          (activity === "Today" && (contact.activityDays ?? 99) === 0) ||
          (activity === "Last 7 Days" && (contact.activityDays ?? 99) <= 7) ||
          (activity === "Last 30 Days" && (contact.activityDays ?? 99) <= 30) ||
          (activity === "No Activity" && contact.activityDays === null) ||
          (activity === "Overdue Follow-up" && contact.overdue);

        return (
          matchesSearch &&
          (type === "All types" || contact.type === type) &&
          (status === "All statuses" || contact.status === status) &&
          (company === "All companies" || contact.company === company) &&
          (owner === "All owners" || contact.owner === owner) &&
          (source === "All sources" || contact.source === source) &&
          (tag === "All tags" || contact.tags.includes(tag)) &&
          matchesActivity
        );
      })
      .sort((a, b) => {
        if (sort === "Name A-Z") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "Highest Deal Value") {
          return b.pipeline - a.pipeline;
        }

        if (sort === "Last Activity") {
          return (a.activityDays ?? 99) - (b.activityDays ?? 99);
        }

        if (sort === "Next Follow-up") {
          return a.followUp.localeCompare(b.followUp);
        }

        if (sort === "Company A-Z") {
          return a.company.localeCompare(b.company);
        }

        return b.id - a.id;
      });
  }, [contacts, query, type, status, company, owner, source, tag, activity, sort]);

  const visible = filtered.slice(0, pageSize);

  const all = visible.length > 0 && visible.every((contact) => selected.includes(contact.id));

  /* ===================================================
     Update Contact
  =================================================== */

  const update = (id: number, patch: Partial<Contact>, message: string) => {
    setContacts((rows) =>
      rows.map((contact) => (contact.id === id ? { ...contact, ...patch } : contact)),
    );

    setActive((contact) => (contact?.id === id ? { ...contact, ...patch } : contact));

    toast.success(message);
  };

  /* ===================================================
     Reset Filters
  =================================================== */

  const reset = () => {
    setQuery("");
    setType("All types");
    setStatus("All statuses");
    setCompany("All companies");
    setOwner("All owners");
    setSource("All sources");
    setTag("All tags");
    setActivity("Any activity");
    setSort("Recently Added");
  };

  /* ===================================================
     CSV Export
  =================================================== */

  const exportCsv = (rows = filtered) => {
    const csv = [
      "Name,Email,Company,Owner,Status,Pipeline",
      ...rows.map((contact) =>
        [
          contact.name,
          contact.email,
          contact.company,
          contact.owner,
          contact.status,
          contact.pipeline,
        ].join(","),
      ),
    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    link.download = "crm-contacts.csv";
    link.click();

    URL.revokeObjectURL(link.href);

    toast.success("Contacts export downloaded");
  };

  /* ===================================================
     Edit Contact
  =================================================== */

  const edit = (contact: Contact) => {
    setActive(contact);

    const name = contact.name.split(" ");

    setForm({
      first: name[0],
      last: name.slice(1).join(" "),
      email: contact.email,
      phone: contact.phone,
      role: contact.role,
      company: contact.company,
      type: contact.type,
      status: contact.status,
      owner: contact.owner,
      source: contact.source,
      score: String(contact.score),
      tags: contact.tags.join(", "),
      followUp: contact.followUp,
      notes: contact.notes.join(" "),
    });

    setModal("edit");
  };

  /* ===================================================
     Save Contact
  =================================================== */

  const save = () => {
    if (!form.first || !form.last || (form.email && !/^\S+@\S+\.\S+$/.test(form.email))) {
      toast.error("Enter first name, last name and a valid email");
      return;
    }

    const patch = {
      name: `${form.first} ${form.last}`,
      email: form.email,
      phone: form.phone,
      role: form.role,
      company: form.company,
      type: form.type,
      status: form.status,
      owner: form.owner,
      source: form.source,
      score: Number(form.score) || 0,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      followUp: form.followUp,
      notes: form.notes ? [form.notes] : [],
    };

    if (modal === "add") {
      setContacts((current) => [
        ...current,
        {
          ...patch,
          id: Date.now(),
          pipeline: 0,
          activity: "Profile created",
          activityDays: 0,
          overdue: false,
          tasks: [],
          initials: `${form.first[0]}${form.last[0]}`.toUpperCase(),
          industry: "Technology",
          location: "New York, US",
        },
      ]);

      toast.success("Contact created");
    } else if (active) {
      update(active.id, patch, "Contact updated");
    }

    setModal(null);
  };

  /* ===================================================
     Confirm Modal Actions
  =================================================== */

  const confirm = () => {
    if (modal === "bulkOwner") {
      setContacts((current) =>
        current.map((contact) =>
          selected.includes(contact.id)
            ? {
                ...contact,
                owner: bulk,
              }
            : contact,
        ),
      );
    } else if (modal === "bulkStatus") {
      setContacts((current) =>
        current.map((contact) =>
          selected.includes(contact.id)
            ? {
                ...contact,
                status: bulk as Status,
              }
            : contact,
        ),
      );
    } else if (modal === "bulkTag") {
      setContacts((current) =>
        current.map((contact) =>
          selected.includes(contact.id)
            ? {
                ...contact,
                tags: [...contact.tags, bulk],
              }
            : contact,
        ),
      );
    } else if (modal === "bulkDelete") {
      setContacts((current) => current.filter((contact) => !selected.includes(contact.id)));

      setSelected([]);
    } else if (active && modal === "note" && note.trim()) {
      update(
        active.id,
        {
          notes: [...active.notes, note],
        },
        "Note added",
      );
    } else if (active && modal === "task" && task.trim()) {
      update(
        active.id,
        {
          tasks: [...active.tasks, task],
        },
        "Follow-up task created",
      );
    } else if (active && modal === "owner") {
      update(active.id, { owner: bulk }, "Contact owner assigned");
    } else if (active && modal === "archive") {
      update(active.id, { status: "Archived" }, "Contact archived");
    } else if (active && modal === "delete") {
      setContacts((current) => current.filter((contact) => contact.id !== active.id));

      setActive(null);

      toast.success("Contact deleted from demo data");
    } else {
      return;
    }

    if (modal?.startsWith("bulk")) {
      toast.success("Bulk action completed");
    }

    setModal(null);
    setNote("");
    setTask("");
  };

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle="Manage people, relationships, ownership and engagement across your CRM."
        breadcrumb={["Vexui", "CRM", "Contacts"]}
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
              Add contact
            </Button>
          </>
        }
      />

      {/* =================================================
          CRM Summary
      ================================================= */}

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Contacts", "12,486"],
            ["Active", "9,842"],
            ["New This Month", "684"],
            ["Qualified", "2,146"],
            ["Needs Follow-up", "318"],
            ["VIP / Strategic", "126"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[140px] flex-1 px-5 py-3">
              <small className="text-muted-foreground">{label}</small>

              <b className="block text-lg">{value}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        {/* =================================================
            Search & Filters
        ================================================= */}

        <div className="border-b p-4">
          <label className="relative mb-3 block max-w-md">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              aria-label="Search contacts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people, company, title or tags"
              className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              [type, setType, ["All types", "Lead", "Customer", "Partner", "Vendor", "Prospect"]],
              [
                status,
                setStatus,
                ["All statuses", "Active", "New", "Qualified", "Nurturing", "Inactive", "Archived"],
              ],
              [
                company,
                setCompany,
                [
                  "All companies",
                  "Acme Inc.",
                  "Vertex Labs",
                  "Vexui Systems",
                  "CloudAxis",
                  "BrightWorks",
                ],
              ],
              [owner, setOwner, ["All owners", ...owners]],
              [
                source,
                setSource,
                [
                  "All sources",
                  "Website",
                  "Referral",
                  "LinkedIn",
                  "Email Campaign",
                  "Event",
                  "Partner",
                  "Manual Entry",
                ],
              ],
              [
                tag,
                setTag,
                [
                  "All tags",
                  "Enterprise",
                  "VIP",
                  "High Intent",
                  "Renewal",
                  "Demo Requested",
                  "Decision Maker",
                  "Technical Buyer",
                ],
              ],
              [
                activity,
                setActivity,
                [
                  "Any activity",
                  "Today",
                  "Last 7 Days",
                  "Last 30 Days",
                  "No Activity",
                  "Overdue Follow-up",
                ],
              ],
              [
                sort,
                setSort,
                [
                  "Recently Added",
                  "Recently Updated",
                  "Name A-Z",
                  "Last Activity",
                  "Highest Deal Value",
                  "Next Follow-up",
                  "Company A-Z",
                ],
              ],
            ].map(([value, setter, options], index) => (
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

            <Button size="sm" variant="ghost" onClick={reset}>
              Reset filters
            </Button>
          </div>
        </div>

        {/* =================================================
            Bulk Actions
        ================================================= */}

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
                setBulk("Qualified");
                setModal("bulkStatus");
              }}
            >
              Change status
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulk("Enterprise");
                setModal("bulkTag");
              }}
            >
              Add tag
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setContacts((current) =>
                  current.map((contact) =>
                    selected.includes(contact.id)
                      ? {
                          ...contact,
                          status: "Archived",
                        }
                      : contact,
                  ),
                );

                toast.success("Selected contacts archived");
              }}
            >
              Archive
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => exportCsv(contacts.filter((contact) => selected.includes(contact.id)))}
            >
              Export
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setModal("bulkDelete")}>
              Delete
            </Button>
          </div>
        )}

        {/* =================================================
            Contacts Table
        ================================================= */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    aria-label="Select all visible contacts"
                    type="checkbox"
                    checked={all}
                    onChange={() => setSelected(all ? [] : visible.map((contact) => contact.id))}
                  />
                </th>

                {[
                  "Contact",
                  "Company",
                  "Role",
                  "Owner",
                  "Status",
                  "Source",
                  "Last activity",
                  "Next follow-up",
                  "Deal value",
                  "",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visible.map((contact) => (
                <tr key={contact.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      aria-label={`Select ${contact.name}`}
                      type="checkbox"
                      checked={selected.includes(contact.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(contact.id)
                            ? current.filter((id) => id !== contact.id)
                            : [...current, contact.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(contact)}
                      className="flex items-center gap-2 text-start"
                    >
                      <img
                        src={getUserImage(contact.name)}
                        alt={contact.name}
                        className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary object-cover"
                      />

                      <span>
                        <b className="block hover:text-primary">{contact.name}</b>

                        <small className="text-muted-foreground">{contact.email}</small>
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-4">
                    <b className="block text-sm">{contact.company}</b>

                    <small className="text-muted-foreground">{contact.industry}</small>
                  </td>

                  <td className="px-3 py-4">{contact.role}</td>

                  <td className="px-3 py-4">
                    <span className="flex items-center gap-1.5">
                      <span className="grid size-6 place-items-center rounded-full bg-muted text-[9px]">
                        {contact.owner
                          .split(" ")
                          .map((item) => item[0])
                          .join("")}
                      </span>

                      {contact.owner}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={statusTone[contact.status]}>{contact.status}</Badge>
                  </td>

                  <td className="px-3 py-4 text-muted-foreground">{contact.source}</td>

                  <td className="px-3 py-4">
                    <p>
                      {contact.activityDays === 0
                        ? "Today"
                        : contact.activityDays
                          ? `${contact.activityDays} days ago`
                          : "No activity"}
                    </p>

                    <small className="text-muted-foreground">{contact.activity}</small>
                  </td>

                  <td className="px-3 py-4">
                    <span className={contact.overdue ? "font-medium text-destructive" : ""}>
                      {contact.followUp}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <b>${(contact.pipeline / 1000).toFixed(contact.pipeline % 1000 ? 1 : 0)}K</b>

                    <small className="block text-muted-foreground">{contact.score} score</small>
                  </td>

                  <td className="px-3 py-4">
                    <Button variant="outline" size="sm" onClick={() => setActive(contact)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =================================================
            Empty State
        ================================================= */}

        {!visible.length && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Icons.ContactRound className="size-8 text-muted-foreground" />

            <b>No matching contacts</b>

            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>

            <Button size="sm" variant="outline" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}

        {/* =================================================
            Pagination
        ================================================= */}

        <div className="flex items-center flex-wrap gap-2 justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing 1-{visible.length} of 12,486 contacts</span>

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
          Contact Details Sheet
      ================================================= */}

      <Sheet
        open={Boolean(active) && !modal}
        onOpenChange={(open) => {
          if (!open) {
            setActive(null);
          }
        }}
      >
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
                  <b className="block">{active.name}</b>

                  <p className="text-sm text-muted-foreground">
                    {active.email} {active.phone}
                  </p>

                  <div className="mt-1 flex gap-1">
                    <Badge tone={statusTone[active.status]}>{active.status}</Badge>

                    {active.tags.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics */}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["Owner", active.owner],
                  ["Source", active.source],
                  ["Lead Score", `${active.score} / Strong`],
                  ["Open deals", "2"],
                  ["Pipeline value", `$${(active.pipeline / 1000).toFixed(1)}K`],
                  ["Next follow-up", active.followUp],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border p-3">
                    <small className="text-muted-foreground">{label}</small>

                    <b className="mt-1 block text-sm">{value}</b>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}

              <section>
                <h3 className="mb-2 font-semibold">Recent activity</h3>

                <div className="space-y-2 rounded-lg border p-3 text-sm text-muted-foreground">
                  <p>
                    {active.activity} {active.activityDays === 0 ? "2 hours ago" : "Recently"}
                  </p>

                  <p>Demo meeting completed Aug 18</p>
                  <p>Follow-up scheduled Aug 16</p>
                </div>
              </section>

              {/* Notes */}

              <section>
                <div className="mb-2 flex justify-between">
                  <h3 className="font-semibold">Recent notes</h3>

                  <Button size="sm" variant="ghost" onClick={() => setModal("note")}>
                    Add note
                  </Button>
                </div>

                <div className="space-y-2">
                  {active.notes.length ? (
                    active.notes.map((item, index) => (
                      <p key={index} className="rounded-lg border p-3 text-sm">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                  )}
                </div>
              </section>

              {/* Tasks */}

              <section>
                <div className="mb-2 flex justify-between">
                  <h3 className="font-semibold">Open tasks</h3>

                  <Button size="sm" variant="ghost" onClick={() => setModal("task")}>
                    Add task
                  </Button>
                </div>

                <div className="space-y-2">
                  {active.tasks.map((item, index) => (
                    <p key={index} className="rounded-lg border p-3 text-sm">
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              {/* Deals */}

              <section>
                <h3 className="mb-2 font-semibold">Associated deals</h3>

                <div className="space-y-2">
                  <div className="flex justify-between rounded-lg border p-3 text-sm">
                    <span>
                      <b>Enterprise Expansion</b>
                      <small className="block text-muted-foreground">Proposal</small>
                    </span>

                    <b>$52K</b>
                  </div>

                  <div className="flex justify-between rounded-lg border p-3 text-sm">
                    <span>
                      <b>Automation Rollout</b>
                      <small className="block text-muted-foreground">Negotiation</small>
                    </span>

                    <b>$32.5K</b>
                  </div>
                </div>
              </section>

              {/* Actions */}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => edit(active)}>
                  Edit
                </Button>

                <Button variant="outline" onClick={() => setModal("owner")}>
                  Assign owner
                </Button>

                <Button
                  variant="outline"
                  onClick={() => toast.success(`Compose email to ${active.email}`)}
                >
                  <Icons.Mail />
                  Email
                </Button>

                <Button
                  variant="outline"
                  onClick={() => toast.success(`Call action ready for ${active.phone}`)}
                >
                  <Icons.Phone />
                  Call
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
          if (!open) {
            setModal(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Contact"
                : modal === "edit"
                  ? "Edit Contact"
                  : modal === "note"
                    ? "Add Note"
                    : modal === "task"
                      ? "Create Follow-up Task"
                      : modal === "owner" || modal === "bulkOwner"
                        ? "Assign Contact Owner"
                        : modal === "archive"
                          ? "Archive this contact?"
                          : modal === "delete"
                            ? "Delete this contact?"
                            : modal === "bulkStatus"
                              ? "Change contact status"
                              : modal === "bulkTag"
                                ? "Add tag to selected contacts"
                                : "Delete selected contacts?"}
            </DialogTitle>

            <DialogDescription>
              {modal === "archive"
                ? "The contact remains in records and can be restored later."
                : modal === "delete" || modal === "bulkDelete"
                  ? "This is demo behavior and removes records only from local state."
                  : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {(modal === "add" || modal === "edit") && <ContactForm form={form} setForm={setForm} />}

          {modal === "note" && (
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Write an internal note"
              rows={4}
              className="w-full rounded-md border bg-background p-3"
            />
          )}

          {modal === "task" && (
            <input
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="Task title"
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

          {modal === "bulkStatus" && (
            <select
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {(["New", "Qualified", "Nurturing", "Active", "Inactive"] as Status[]).map((item) => (
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
              onClick={modal === "add" || modal === "edit" ? save : confirm}
            >
              {modal === "add"
                ? "Create Contact"
                : modal === "edit"
                  ? "Save Changes"
                  : modal === "note"
                    ? "Add Note"
                    : modal === "task"
                      ? "Create Task"
                      : modal === "archive"
                        ? "Archive"
                        : modal === "delete" || modal === "bulkDelete"
                          ? "Delete"
                          : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
