"use client";
import { useState, useMemo } from "react";
import { useGetProjectsQuery } from "@/store/api/project.api";
import { useAppSelector } from "@/store/hooks";
import type { Project, ProjectStatus } from "@/types/project.types";
import { ViewMode } from "@/components/modules/project/ProjectViewToggle";
import { ProjectsHeader } from "@/components/modules/project/ProjectsHeader";
import { ProjectStatsRow } from "@/components/modules/project/ProjectStatsRow";
import { ProjectFilters } from "@/components/modules/project/ProjectFilters";
import { ProjectsSkeletonGrid, ProjectsSkeletonTable } from "@/components/modules/project/ProjectsSkeleton";
import { ProjectGridView } from "@/components/modules/project/ProjectGridView";
import { ProjectTableView } from "@/components/modules/project/ProjectTableView";
import { CreateProjectModal } from "@/components/modules/project/CreateProjectModal";
import { DeleteProjectDialog } from "@/components/modules/project/DeleteProjectDialog";


export default function ProjectsPage() {
  // ─── View & filter state ─────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"" | ProjectStatus>("");

  // ─── Modal / dialog state ─────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const user = useAppSelector((s) => s.auth.user);
  const canCreate = user?.role === "admin" || user?.role === "manager";

  // ─── Data ────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useGetProjectsQuery(
    { status: activeStatus || undefined },
    { refetchOnMountOrArgChange: true }
  );

  const projects = data ?? [];

  // Client-side search filter (on top of server status filter)
  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
    );
  }, [projects, search]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleEdit = (project: Project) => setEditProject(project);
  const handleDelete = (project: Project) => setDeleteProject(project);
  const handleCreateOpen = () => {
    setEditProject(null);
    setCreateOpen(true);
  };

  // ─── Error state ──────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-destructive">
          Failed to load projects.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Page header */}
      <ProjectsHeader
        view={view}
        onViewChange={setView}
        onCreateClick={handleCreateOpen}
        canCreate={canCreate}
      />

      {/* Summary stats */}
      <ProjectStatsRow projects={projects} isLoading={isLoading} />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground -mt-2">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Grid / Table view */}
      {isLoading ? (
        view === "grid" ? (
          <ProjectsSkeletonGrid />
        ) : (
          <ProjectsSkeletonTable />
        )
      ) : view === "grid" ? (
        <ProjectGridView
          projects={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ProjectTableView
          projects={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create / Edit modal */}
      <CreateProjectModal
        open={createOpen || !!editProject}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditProject(null);
          }
        }}
        editProject={editProject}
      />

      {/* Delete confirmation */}
      <DeleteProjectDialog
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
      />
    </div>
  );
}
