import { useState, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CodeCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
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

export function DropdownsShowcase() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [view, setView] = useState("Board");

  const action = (message: string) => toast.message(message);

  return (
    <>
      <PageHeader
        title="Dropdowns"
        subtitle="Accessible menus, selections and contextual actions built with the existing menu primitives."
        breadcrumb={["Components", "UI Elements", "Dropdowns"]}
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
          title="Basic actions"
          description="A standard contextual menu with icons, shortcuts and destructive action."
          code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent></DropdownMenuContent>
</DropdownMenu>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Project actions
                <Icons.ChevronDown className="ms-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Website Redesign</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => action("Edit project")}>
                <Icons.Pencil />
                Edit
                <DropdownMenuShortcut>E</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => action("Project duplicated")}>
                <Icons.Copy />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => action("Project archived")}>
                <Icons.Archive />
                Archive
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => action("Delete confirmation opened")}
              >
                <Icons.Trash2 />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CodeCard>

        <CodeCard
          title="Icon menu"
          description="A compact trigger for row-level actions, with accessible text labels."
          code={`<DropdownMenuTrigger asChild>
  <Button size="icon" variant="ghost" aria-label="More actions">
    <MoreHorizontal />
  </Button>
</DropdownMenuTrigger>`}
        >
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icons.FolderOpen className="size-4" />
            </span>

            <span className="flex-1">
              <b className="block text-sm">Design assets</b>
              <small className="text-muted-foreground">Updated 12 minutes ago</small>
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More actions">
                  <Icons.MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => action("File renamed")}>
                  <Icons.Pencil />
                  Rename
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => action("Download started")}>
                  <Icons.Download />
                  Download
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => action("Link copied")}>
                  <Icons.Link />
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CodeCard>

        <CodeCard
          title="Checkbox menu"
          description="Persistent display preferences using checkbox menu items."
          code={`<DropdownMenuCheckboxItem
  checked={showSidebar}
  onCheckedChange={setShowSidebar}
>
  Show sidebar
</DropdownMenuCheckboxItem>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Display options
                <Icons.SlidersHorizontal className="ms-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Visible panels</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                Show sidebar
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
                Show activity feed
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem checked>Show project health</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="mt-4 text-sm text-muted-foreground">
            Sidebar: {showSidebar ? "visible" : "hidden"} Activity:{" "}
            {showActivity ? "visible" : "hidden"}
          </p>
        </CodeCard>

        <CodeCard
          title="Radio selection"
          description="Single-choice views with a selected menu indicator."
          code={`<DropdownMenuRadioGroup value={view} onValueChange={setView}>
  <DropdownMenuRadioItem value="Board">Board</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                View: {view}
                <Icons.ChevronDown className="ms-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Project view</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuRadioGroup value={view} onValueChange={setView}>
                <DropdownMenuRadioItem value="Board">Board</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="List">List</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Timeline">Timeline</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CodeCard>

        <CodeCard
          title="Nested actions"
          description="Use submenus for grouped actions without cluttering the primary menu."
          code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
  <DropdownMenuSubContent></DropdownMenuSubContent>
</DropdownMenuSub>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="soft">
                Task menu
                <Icons.ChevronDown className="ms-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => action("Task opened")}>
                <Icons.Eye />
                View task
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icons.ArrowRightLeft />
                  Move to
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => action("Moved to To do")}>
                    To do
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => action("Moved to In progress")}>
                    In progress
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => action("Moved to Done")}>Done</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => action("Task duplicated")}>
                <Icons.Copy />
                Duplicate task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CodeCard>

        <CodeCard
          title="Split action"
          description="Primary save action plus a dropdown for related options."
          code={`<Button>Save changes</Button>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button aria-label="More save actions">
      <ChevronDown />
    </Button>
  </DropdownMenuTrigger>
</DropdownMenu>`}
        >
          <div className="inline-flex">
            <Button className="rounded-e-none" onClick={() => toast.success("Changes saved")}>
              Save changes
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-s-none border-s border-primary-foreground/25 px-2"
                  aria-label="More save actions"
                >
                  <Icons.ChevronDown />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => action("Saved as draft")}>
                  Save as draft
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => toast.success("Saved and published")}>
                  Save & publish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
