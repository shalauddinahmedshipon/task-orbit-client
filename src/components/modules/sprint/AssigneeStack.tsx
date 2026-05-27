// components/sprint-detail/AssigneeStack.tsx
"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TaskAssignee } from "@/types/task.types";
import { avatarColor, initials } from "@/utils/task.utils";

interface AssigneeStackProps {
  assignees: TaskAssignee[];
  max?: number;
  size?: "sm" | "md";
}

export function AssigneeStack({ assignees, max = 3, size = "sm" }: AssigneeStackProps) {
  const visible  = assignees.slice(0, max);
  const overflow = assignees.length - max;
  const sz = size === "sm" ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs";

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((a, i) => (
        <Tooltip key={a._id}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "rounded-full flex items-center justify-center font-medium border-2 border-background ring-1 ring-border shrink-0",
                avatarColor(i),
                sz
              )}
            >
              {initials(a.name)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">{a.name}</TooltipContent>
        </Tooltip>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-medium border-2 border-background bg-muted text-muted-foreground",
            sz
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
