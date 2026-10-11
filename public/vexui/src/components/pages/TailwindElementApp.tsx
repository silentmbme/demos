import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

export function TailwindElementApp({ element }: { element: string }) {
  const [query, setQuery] = useState("");

  const rows = [
    ["Website Redesign", "Sophia Carter", "Active", "12 min ago"],
    ["CRM Migration", "Olivia Smith", "Review", "1 hour ago"],
    ["Mobile App v2", "Daniel Lee", "Planning", "Yesterday"],
  ].filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));

  if (element !== "tables") return null;

  return (
    <>
      <PageHeader
        title="Data Tables"
        subtitle="Responsive data tables, status cells and row actions."
        breadcrumb={["Components", "UI Elements", "Data Tables"]}
        actions={
          <Button variant="outline" onClick={() => location.assign("/ui/buttons")}>
            Buttons
          </Button>
        }
      />

      <Card
        title="Data table examples"
        description="A responsive operational table using the current theme tokens."
      >
        <div className="mb-4 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm"
          />

          <Button variant="outline" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-start text-sm">
            <thead className="border-b bg-muted/35 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Project", "Owner", "Status", "Updated", ""].map((item) => (
                  <th key={item} className="px-4 py-3">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-b transition hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{row[0]}</td>

                  <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>

                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row[2] === "Active"
                          ? "success"
                          : row[2] === "Review"
                            ? "warning"
                            : "primary"
                      }
                    >
                      {row[2]}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>

                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.message(`${row[0]} opened`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
