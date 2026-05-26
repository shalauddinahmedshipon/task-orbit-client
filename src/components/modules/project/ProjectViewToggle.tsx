"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "table";

interface Props {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

export function ProjectViewToggle({ view, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-muted/40 p-0.5">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded",
          view === "grid" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        title="Grid view"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded",
          view === "table" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("table")}
        aria-label="Table view"
        title="Table view"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
