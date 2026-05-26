import { Timer } from "lucide-react";
import { SprintCard } from "./SprintCard";
import type { Sprint } from "@/types/sprint.types";

interface Props {
  sprints: Sprint[];
  projectId: string;
  canManage: boolean;
  onEdit: (sprint: Sprint) => void;
  onDelete: (sprint: Sprint) => void;
}

export function SprintList({ sprints, projectId, canManage, onEdit, onDelete }: Props) {
  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed">
        <Timer className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No sprints yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {canManage
            ? "Create the first sprint to start organizing tasks."
            : "No sprints have been created for this project yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sprints.map((sprint, i) => (
        <SprintCard
          key={sprint._id}
          sprint={sprint}
          projectId={projectId}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
          defaultOpen={i === 0} // open the latest sprint by default
        />
      ))}
    </div>
  );
}
