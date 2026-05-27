// components/sprint-detail/SprintSwitcher.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, PlayCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Sprint } from "@/types/sprint.types";

interface SprintSwitcherProps {
  sprints: Sprint[];
  activeSprint: Sprint;
  projectId: string;
  canManage: boolean;
  onCreateSprint: () => void;
}

export function SprintSwitcher({
  sprints,
  activeSprint,
  projectId,
  canManage,
  onCreateSprint,
}: SprintSwitcherProps) {
  const router = useRouter();
  const sorted = [...sprints].sort((a, b) => a.order - b.order);

  return (
    <ScrollArea className="w-full">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 pb-1">
        {sorted.map((s) => {
          const isSelected  = s._id === activeSprint._id;
          const isCompleted = new Date(s.endDate) < new Date();

          const icon = isCompleted ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : isSelected ? (
            <PlayCircle className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0" />
          );

          return (
            <button
              key={s._id}
              onClick={() =>
                router.push(
                  `/dashboard/admin/projects/${projectId}/sprint/${s._id}`
                )
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                isSelected
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : isCompleted
                  ? "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {icon}
              {s.title}
            </button>
          );
        })}

        {canManage && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-7 text-xs"
            onClick={onCreateSprint}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add sprint
          </Button>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
