"use client";

import { useState, useMemo } from "react";
import { useGetProjectsQuery } from "@/store/api/project.api";
import type { Project, ProjectStatus } from "@/types/project.types";

import { ViewMode } from "@/components/modules/project/ProjectViewToggle";
import { ProjectsHeader } from "@/components/modules/project/ProjectsHeader";
import { ProjectStatsRow } from "@/components/modules/project/ProjectStatsRow";
import { ProjectFilters } from "@/components/modules/project/ProjectFilters";
import {
  ProjectsSkeletonGrid,
  ProjectsSkeletonTable,
} from "@/components/modules/project/ProjectsSkeleton";
import { ProjectGridView } from "@/components/modules/project/ProjectGridView";
import { ProjectTableView } from "@/components/modules/project/ProjectTableView";

export default function MemberProjectsPage() {
  // ── UI state ───────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<
    "" | ProjectStatus
  >("");

  // ── Data ────────────────────────────────────────────────────
  const { data, isLoading, isError } = useGetProjectsQuery(
    { status: activeStatus || undefined },
    { refetchOnMountOrArgChange: true }
  );

  const projects = data ?? [];

  // ── client-side search filter ───────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return projects;

    const q = search.toLowerCase();

    return projects.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client ?? "").toLowerCase().includes(q)
      );
    });
  }, [projects, search]);

  // ── error state ─────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-red-500">
          Failed to load projects
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* ── Header (NO create button for member) ───────────── */}
      <ProjectsHeader
        view={view}
        onViewChange={setView}
        canCreate={false}
      />

      {/* ── Stats (read-only) ──────────────────────────────── */}
      <ProjectStatsRow
        projects={projects}
        isLoading={isLoading}
      />

      {/* ── Filters ────────────────────────────────────────── */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* ── count info ─────────────────────────────────────── */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground -mt-2">
          {filtered.length} project
          {filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* ── loading state ───────────────────────────────────── */}
      {isLoading ? (
        view === "grid" ? (
          <ProjectsSkeletonGrid />
        ) : (
          <ProjectsSkeletonTable />
        )
      ) : view === "grid" ? (
        <ProjectGridView
          projects={filtered}
          onEdit={undefined}
          onDelete={undefined}
        />
      ) : (
        <ProjectTableView
          projects={filtered}
          onEdit={undefined}
          onDelete={undefined}
        />
      )}
    </div>
  );
}