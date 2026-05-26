import { FolderOpen } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project.types";

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectGridView({ projects, onEdit, onDelete }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm font-medium text-muted-foreground">No projects found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Try adjusting your filters or create a new project.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
