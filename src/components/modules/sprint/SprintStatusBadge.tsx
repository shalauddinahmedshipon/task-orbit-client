import { cn } from "@/lib/utils";
import type { Sprint } from "@/types/sprint.types";
import { getSprintStatus, SPRINT_STATUS_CONFIG } from "@/utils/sprint.utils";

interface Props {
  sprint: Sprint;
  className?: string;
}

export function SprintStatusBadge({ sprint, className }: Props) {
  const status = getSprintStatus(sprint);
  const config = SPRINT_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
