"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { useGetProjectQuery } from "@/store/api/project.api";
import { useGetSprintsQuery } from "@/store/api/sprint.api";
import type { Sprint } from "@/types/sprint.types";
import { ProjectDetailSkeleton } from "@/components/modules/project/ProjectDetailSkeleton";
import { ProjectDetailHeader } from "@/components/modules/project/ProjectDetailHeader";
import { SprintList } from "@/components/modules/sprint/SprintList";
import { ProjectMembersPanel } from "@/components/modules/project/ProjectMembersPanel";
import { CreateSprintModal } from "@/components/modules/sprint/CreateSprintModal";
import { DeleteSprintDialog } from "@/components/modules/sprint/DeleteSprintDialog";
import { CreateProjectModal } from "@/components/modules/project/CreateProjectModal";
import { DeleteProjectDialog } from "@/components/modules/project/DeleteProjectDialog";


export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const user = useAppSelector((s) => s.auth.user);
  const canManage = user?.role === "admin" || user?.role === "manager";

  // ─── Data ────────────────────────────────────────────────────────────────
  const {
    data: project,
    isLoading: loadingProject,
    isError: projectError,
  } = useGetProjectQuery(projectId);

  const {
    data: sprints = [],
    isLoading: loadingSprints,
  } = useGetSprintsQuery({ projectId });
console.log(project,sprints);
  // ─── Sprint modal state ──────────────────────────────────────────────────
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [editSprint, setEditSprint] = useState<Sprint | null>(null);
  const [deleteSprint, setDeleteSprint] = useState<Sprint | null>(null);

  // ─── Project modal state ─────────────────────────────────────────────────
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleEditSprint = (sprint: Sprint) => {
    setEditSprint(sprint);
    setSprintModalOpen(true);
  };

  const handleDeleteSprint = (sprint: Sprint) => {
    setDeleteSprint(sprint);
  };

  const handleSprintModalClose = (open: boolean) => {
    setSprintModalOpen(open);
    if (!open) setEditSprint(null);
  };

  // After project delete, navigate back to list
  const handleDeleteProjectClose = () => {
    setDeleteProjectOpen(false);
    router.push("/projects");
  };

  // ─── States ───────────────────────────────────────────────────────────────
  const isLoading = loadingProject || loadingSprints;

  if (isLoading) return <ProjectDetailSkeleton />;

  if (projectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center p-6">
        <p className="text-sm font-medium text-destructive">
          Project not found or you don't have access.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/dashboard/admin/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* ── Project header banner ─────────────────────────────────────────── */}
      <ProjectDetailHeader
        project={project}
        canManage={canManage}
        onEdit={() => setEditProjectOpen(true)}
        onDelete={() => setDeleteProjectOpen(true)}
      />

      {/* ── Two-column layout: sprints left, members right ───────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

        {/* ── Sprints section ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Sprints</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sprints.length} sprint{sprints.length !== 1 ? "s" : ""}
              </p>
            </div>
            {canManage && (
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => {
                  setEditSprint(null);
                  setSprintModalOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                New Sprint
              </Button>
            )}
          </div>

          {/* Sprint cards */}
          <SprintList
            sprints={sprints}
            projectId={projectId}
            canManage={canManage}
            onEdit={handleEditSprint}
            onDelete={handleDeleteSprint}
          />
        </div>

        {/* ── Members panel — stacks below sprints on mobile ───────────────── */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ProjectMembersPanel project={project} canManage={canManage} />
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <CreateSprintModal
        open={sprintModalOpen}
        onOpenChange={handleSprintModalClose}
        projectId={projectId}
        editSprint={editSprint}
      />

      <DeleteSprintDialog
        sprint={deleteSprint}
        onClose={() => setDeleteSprint(null)}
      />

      {/* Reuse the project create/edit modal from the projects page */}
      <CreateProjectModal
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        editProject={project}
      />

      <DeleteProjectDialog
        project={deleteProjectOpen ? project : null}
        onClose={handleDeleteProjectClose}
      />
    </div>
  );
}
