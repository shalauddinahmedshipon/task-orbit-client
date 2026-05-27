"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetProjectQuery } from "@/store/api/project.api";
import { useGetSprintsQuery } from "@/store/api/sprint.api";

import { Button } from "@/components/ui/button";
import { ProjectDetailSkeleton } from "@/components/modules/project/ProjectDetailSkeleton";
import { ProjectDetailHeader } from "@/components/modules/project/ProjectDetailHeader";
import { SprintList } from "@/components/modules/sprint/SprintList";
import { ProjectMembersPanel } from "@/components/modules/project/ProjectMembersPanel";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function MemberProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  // ─── auth ─────────────────────────────────────────────
  const user = useAppSelector((s) => s.auth.user);
  const canManage = user?.role === "admin" || user?.role === "manager";

  // ─── data ─────────────────────────────────────────────
  const {
    data: project,
    isLoading: loadingProject,
    isError,
  } = useGetProjectQuery(projectId);

  const { data: sprints = [], isLoading: loadingSprints } =
    useGetSprintsQuery({ projectId });

  const isLoading = loadingProject || loadingSprints;

  if (isLoading) return <ProjectDetailSkeleton />;

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center p-6">
        <p className="text-sm font-medium text-destructive">
          Project not found or access denied.
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            router.push("/dashboard/member/projects")
          }
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">

      {/* ─── Breadcrumb ───────────────────────────── */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/member">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/member/projects">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{project.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ─── Header (READ ONLY) ───────────────────── */}
      <ProjectDetailHeader
        project={project}
        canManage={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      {/* ─── Layout ───────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

        {/* ─── Sprints (READ ONLY / LIMITED ACTIONS) ─── */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-semibold">Sprints</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sprints.length} sprint{sprints.length !== 1 ? "s" : ""}
            </p>
          </div>

          <SprintList
            sprints={sprints}
            projectId={projectId}
            canManage={false}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        {/* ─── Members Panel (READ ONLY) ───────────── */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ProjectMembersPanel
            project={project}
            canManage={false}
          />
        </div>
      </div>
    </div>
  );
}