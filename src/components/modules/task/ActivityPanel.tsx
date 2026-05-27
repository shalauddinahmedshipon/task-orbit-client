// components/task-detail/ActivityPanel.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2, ArrowRight } from "lucide-react";
import { useGetActivityLogsByTaskQuery } from "@/store/api/activitylog.api";
import type { ActivityLog } from "@/types/task-detail.types";
import { initials, avatarColor } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface ActivityPanelProps {
  taskId: string;
}

// Human-readable action labels
function formatAction(log: ActivityLog): { label: string; color: string } {
  const action = log.action?.toLowerCase() ?? "";

  if (action.includes("status")) {
    return { label: "changed status", color: "bg-blue-500" };
  }
  if (action.includes("assign")) {
    return { label: "updated assignees", color: "bg-violet-500" };
  }
  if (action.includes("priority")) {
    return { label: "changed priority", color: "bg-amber-500" };
  }
  if (action.includes("approv") || action.includes("done")) {
    return { label: "approved task", color: "bg-emerald-500" };
  }
  if (action.includes("comment")) {
    return { label: "commented", color: "bg-slate-400" };
  }
  if (action.includes("attach")) {
    return { label: "added attachment", color: "bg-blue-400" };
  }
  if (action.includes("creat")) {
    return { label: "created task", color: "bg-emerald-500" };
  }
  return { label: log.action, color: "bg-slate-400" };
}

export function ActivityPanel({ taskId }: ActivityPanelProps) {
  const { data: logs = [], isLoading } = useGetActivityLogsByTaskQuery(taskId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No activity yet.
      </p>
    );
  }

  return (
   <div className="space-y-0">
  {logs.map((log, idx) => {
    const { label, color } = formatAction(log);
    const isLast = idx === logs.length - 1;

    return (
      <div key={log._id} className="flex gap-3">
        {/* timeline line */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full mt-1.5 shrink-0",
              color
            )}
          />
          {!isLast && (
            <div className="w-px flex-1 bg-border mt-1 mb-1" />
          )}
        </div>

        <div className={cn("flex-1 min-w-0 pb-4", isLast && "pb-0")}>
          <div className="flex items-start gap-2 flex-wrap">

            {/* Avatar */}
            {log.userId.avatarUrl ? (
              <img
                src={log.userId.avatarUrl}
                alt={log.userId.name}
                className="h-5 w-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-semibold shrink-0",
                  avatarColor(idx)
                )}
              >
                {initials(log.userId.name)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed">
                
                <span className="font-medium">
                  {log.userId.name}
                </span>

                {/* Role badge */}
                {log.userId.role && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize align-middle">
                    {log.userId.role}
                  </span>
                )}

                {" "}
                <span className="text-muted-foreground">
                  {label}
                </span>

                {log.oldValue && log.newValue && (
                  <span className="text-muted-foreground">
                    {" "}
                    <span className="line-through">
                      {log.oldValue}
                    </span>
                    {" "}
                    <ArrowRight className="inline h-3 w-3" />
                    {" "}
                    <span className="font-medium text-foreground">
                      {log.newValue}
                    </span>
                  </span>
                )}
              </p>

              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(
                  new Date(log.createdAt),
                  { addSuffix: true }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
  );
}
