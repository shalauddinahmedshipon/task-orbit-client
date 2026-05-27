"use client";

import { useMemo } from "react";
import { useGetMyTimeLogsQuery } from "@/store/api/timelog.api";
import { useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import Loader from "@/components/ui/loading";

export default function MemberTimeLogsPage() {
  const user = useAppSelector((s) => s.auth.user);

  // ── data ─────────────────────────────────────────────
  const { data: logs = [], isLoading, isError } = useGetMyTimeLogsQuery();

  // ── derived stats ────────────────────────────────────
  const stats = useMemo(() => {
    const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);

    const thisWeekHours = logs.reduce((sum, l) => {
      const d = new Date(l.logDate);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7 ? sum + l.hours : sum;
    }, 0);

    return {
      totalHours,
      thisWeekHours,
      totalLogs: logs.length,
    };
  }, [logs]);

  // ── loading state ────────────────────────────────────
  if (isLoading) return <Loader/>

  // ── error state ──────────────────────────────────────
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load time logs.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">My Time Logs</h1>
        <p className="text-sm text-muted-foreground">
          Track your working hours and task activity
        </p>
      </div>

      {/* ── Summary Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            Total Hours
          </div>
          <p className="text-2xl font-bold mt-2">
            {stats.totalHours.toFixed(1)}h
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            This Week
          </div>
          <p className="text-2xl font-bold mt-2">
            {stats.thisWeekHours.toFixed(1)}h
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-muted-foreground text-sm">
            Total Logs
          </div>
          <p className="text-2xl font-bold mt-2">
            {stats.totalLogs}
          </p>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="border rounded-xl overflow-hidden">

        <div className="grid grid-cols-4 bg-muted px-4 py-3 text-sm font-medium">
          <div>Task</div>
          <div>Date</div>
          <div>Hours</div>
          <div>Description</div>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No time logs found
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="grid grid-cols-4 px-4 py-3 border-t text-sm"
            >
              <div className="font-medium">
                {typeof log.taskId === "object" && log.taskId !== null && "title" in log.taskId
                  ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - taskId can be a populated object with title
                    log.taskId.title
                  : "Task"}
              </div>

              <div>
                {new Date(log.logDate).toLocaleDateString()}
              </div>

              <div className="font-semibold">
                {log.hours}h
              </div>

              <div className="text-muted-foreground ">
                {log.description || "-"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}