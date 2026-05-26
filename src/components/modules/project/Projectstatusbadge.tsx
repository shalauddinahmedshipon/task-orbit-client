import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project.types";
import { STATUS_CONFIG } from "@/utils/project.utils";

interface Props {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
