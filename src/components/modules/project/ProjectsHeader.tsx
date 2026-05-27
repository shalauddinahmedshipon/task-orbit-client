"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectViewToggle, ViewMode } from "./ProjectViewToggle";


interface Props {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onCreateClick?: () => void;
  canCreate: boolean;
}

export function ProjectsHeader({
  view,
  onViewChange,
  onCreateClick,
  canCreate,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage and track all your projects
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ProjectViewToggle view={view} onChange={onViewChange} />
        {canCreate && (
          <Button size="sm" onClick={onCreateClick} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
      </div>
    </div>
  );
}
