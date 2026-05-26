"use client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project.types";
import { STATUS_FILTER_OPTIONS } from "@/utils/project.utils";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  activeStatus: "" | ProjectStatus;
  onStatusChange: (v: "" | ProjectStatus) => void;
}

export function ProjectFilters({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Status pills */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => onStatusChange(value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeStatus === value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-56">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects…"
          className="pl-8 h-8 text-sm"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
