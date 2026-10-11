import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

function CodeCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      title={title}
      description={description}
      action={
        <Button size="sm" variant="ghost" onClick={() => setShow(!show)}>
          <Icons.Code2 className="me-1 size-4" />
          {show ? "Hide code" : "Show code"}
        </Button>
      }
    >
      {children}
      {show && (
        <pre className="mt-5 overflow-x-auto rounded-xl border bg-muted/45 p-4 text-xs leading-6 text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </Card>
  );
}

function Pager({
  page,
  setPage,
  pages = 8,
  compact = false,
}: {
  page: number;
  setPage: (value: number) => void;
  pages?: number;
  compact?: boolean;
}) {
  const items = compact ? [1, 2, 3] : [1, 2, 3, 4, 5];

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="grid size-9 place-items-center rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
      >
        <Icons.ChevronLeft className="size-4" />
      </button>

      {!compact && page > 3 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="grid size-9 place-items-center rounded-lg border text-sm hover:bg-muted"
          >
            1
          </button>
          <span className="grid size-7 place-items-center text-muted-foreground">...</span>
        </>
      )}

      {items.map((item) => (
        <button
          key={item}
          onClick={() => setPage(item)}
          className={
            page === item
              ? "grid size-9 place-items-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
              : "grid size-9 place-items-center rounded-lg border text-sm hover:bg-muted"
          }
        >
          {item}
        </button>
      ))}

      {!compact && (
        <>
          <span className="grid size-7 place-items-center text-muted-foreground">...</span>

          <button
            onClick={() => setPage(pages)}
            className={
              page === pages
                ? "grid size-9 place-items-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
                : "grid size-9 place-items-center rounded-lg border text-sm hover:bg-muted"
            }
          >
            {pages}
          </button>
        </>
      )}

      <button
        aria-label="Next page"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="grid size-9 place-items-center rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
      >
        <Icons.ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

export function PaginationShowcase() {
  const [page, setPage] = useState(3);
  const [simplePage, setSimplePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tablePage, setTablePage] = useState(1);

  const records = useMemo(
    () =>
      Array.from({ length: 19 }, (_, index) => ({
        id: `PRJ-${1042 + index}`,
        name: [
          "Website Redesign",
          "Mobile App",
          "Brand Refresh",
          "Customer Portal",
          "Analytics Hub",
        ][index % 5],
        owner: ["Sophia Carter", "Daniel Lee", "Mia Chen", "Noah Bennett"][index % 4],
        status: index % 5 === 0 ? "At risk" : "On track",
      })),
    [],
  );

  const visible = records.slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage);

  const tablePages = Math.ceil(records.length / rowsPerPage);

  const updateRows = (count: number) => {
    setRowsPerPage(count);
    setTablePage(1);
  };

  return (
    <>
      <PageHeader
        title="Pagination"
        subtitle="Navigate long collections with clear page state, result context and accessible controls."
        breadcrumb={["Components", "UI Elements", "Pagination"]}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>
            <Button>
              <Icons.FilePlus2 className="me-2 size-4" />
              Create report
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <CodeCard
          title="Numbered pagination"
          description="The standard pattern for known result pages."
          code={"<Pagination page={page} totalPages={8} onPageChange={setPage} />"}
        >
          <Pager page={page} setPage={setPage} pages={8} />
          <p className="mt-4 text-sm text-muted-foreground">
            Viewing page <b className="text-foreground">{page}</b> of 8
          </p>
        </CodeCard>

        <CodeCard
          title="Previous and next"
          description="A simple choice for linear flows and focused detail lists."
          code={
            "<Button onClick={previous}>Previous</Button>\n<Button onClick={next}>Next</Button>"
          }
        >
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={simplePage === 1}
              onClick={() => setSimplePage(simplePage - 1)}
            >
              <Icons.ArrowLeft className="me-2 size-4" />
              Previous
            </Button>

            <span className="rounded-lg bg-muted px-3 py-2 text-sm">Page {simplePage} of 4</span>

            <Button disabled={simplePage === 4} onClick={() => setSimplePage(simplePage + 1)}>
              Next
              <Icons.ArrowRight className="ms-2 size-4" />
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="Compact pagination"
          description="Use a shorter control in narrow cards and mobile layouts."
          code={"<Pagination compact page={page} />"}
        >
          <Pager page={Math.min(page, 3)} setPage={setPage} pages={3} compact />
          <p className="mt-4 text-xs text-muted-foreground">
            The surrounding layout can collapse intermediate page numbers.
          </p>
        </CodeCard>

        <CodeCard
          title="Cursor pagination"
          description="Use cursor-based navigation when total page count is unavailable."
          code={"<Button>Load newer</Button>\n<Button>Load older</Button>"}
        >
          <div className="flex items-center justify-between rounded-xl border bg-muted/15 p-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSimplePage(Math.max(1, simplePage - 1))}
            >
              <Icons.ChevronUp className="me-1 size-4" />
              Newer
            </Button>

            <span className="text-xs text-muted-foreground">Loaded 20 recent updates</span>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSimplePage(Math.min(4, simplePage + 1))}
            >
              Older
              <Icons.ChevronDown className="ms-1 size-4" />
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="Pagination with result count"
          description="Always pair a page control with the result range when possible."
          code={"<span>Showing 21-30 of 84 results</span>\n<Pagination />"}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <b className="text-foreground">
                {(page - 1) * 10 + 1}-{Math.min(page * 10, 84)}
              </b>{" "}
              of <b className="text-foreground">84</b> projects
            </p>

            <Pager page={page} setPage={setPage} pages={8} />
          </div>
        </CodeCard>

        <CodeCard
          title="Jump to page"
          description="Allow direct navigation for large result sets."
          code={'<input type="number" min="1" max="48" />\n<Button>Go</Button>'}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">Go to page</span>

            <input
              aria-label="Page number"
              type="number"
              value={page}
              min={1}
              max={8}
              onChange={(event) =>
                setPage(Math.min(8, Math.max(1, Number(event.target.value) || 1)))
              }
              className="h-9 w-16 rounded-lg border bg-background px-2 text-sm"
            />

            <span className="text-sm text-muted-foreground">of 8</span>

            <Button size="sm" variant="outline">
              Go
            </Button>
          </div>
        </CodeCard>
      </div>

      <Card
        className="mt-5"
        title="Table pagination"
        description="Keep row selection, page size and navigation together at the bottom of a data table."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-start text-sm">
            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Project</th>
                <th className="px-3 py-3">Owner</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-end">ID</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((record) => (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="px-3 py-3 font-medium">{record.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{record.owner}</td>
                  <td className="px-3 py-3">
                    <Badge tone={record.status === "On track" ? "success" : "warning"}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-end font-mono text-xs text-muted-foreground">
                    {record.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>

            <select
              value={rowsPerPage}
              onChange={(event) => updateRows(Number(event.target.value))}
              className="h-9 rounded-lg border bg-background px-2 text-sm text-foreground"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>

            <span>
              {(tablePage - 1) * rowsPerPage + 1}-
              {Math.min(tablePage * rowsPerPage, records.length)} of {records.length}
            </span>
          </div>

          <Pager
            page={tablePage}
            setPage={setTablePage}
            pages={tablePages}
            compact={tablePages <= 3}
          />
        </div>
      </Card>
    </>
  );
}
