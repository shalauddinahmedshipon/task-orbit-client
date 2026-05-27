"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useGetTimeLogsByTaskQuery,
  useCreateTimeLogMutation,
  useDeleteTimeLogMutation,
} from "@/store/api/timelog.api";
import type { TimeLog } from "@/types/task-detail.types";
import { initials, avatarColor } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

const logSchema = z.object({
  hours: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number({ error: "Hours is required" })
      .min(0.5, "Minimum 0.5h")
      .max(24, "Max 24h per entry")
  ),
  logDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

type LogInput = z.input<typeof logSchema>;
type LogOutput = z.output<typeof logSchema>;


interface TimeLogPanelProps {
  taskId: string;
  currentUserId: string;
  canManage: boolean;
}

export function TimeLogPanel({ taskId, currentUserId, canManage }: TimeLogPanelProps) {
  const { data: logs = [], isLoading } = useGetTimeLogsByTaskQuery(taskId);
  const [createLog, { isLoading: creating }] = useCreateTimeLogMutation();
  const [deleteLog] = useDeleteTimeLogMutation();
  const [formOpen, setFormOpen] = useState(false);

 const form = useForm<LogInput, unknown, LogOutput>({
  resolver: zodResolver(logSchema),
  defaultValues: {
    hours: undefined,
    logDate: new Date().toISOString().split("T")[0],
    description: "",
  },
});

const onSubmit: SubmitHandler<LogOutput> = async (values) => {
  try {
    await createLog({ taskId, ...values }).unwrap();
    toast.success("Time logged");
    form.reset();
    setFormOpen(false);
  } catch {
    toast.error("Failed to log time");
  }
};
  const handleDelete = async (log: TimeLog) => {
    try {
      await deleteLog({ logId: log._id, taskId }).unwrap();
      toast.success("Log entry deleted");
    } catch {
      toast.error("Failed to delete log");
    }
  };

  const canDeleteLog = (log: TimeLog) =>
    canManage || log.userId._id === currentUserId;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── log time button / form ───────────────────────────────────── */}
      <Collapsible open={formOpen} onOpenChange={setFormOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {formOpen ? "Cancel" : "Log time"}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 rounded-lg border bg-muted/30 p-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="hours" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Hours <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0.5}
                          max={24}
                          step={0.5}
                          placeholder="0"
                          value={
                            typeof field.value === "number" || typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="logDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Note (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="What did you work on?"
                        {...field}
                        className="resize-none text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs w-full"
                  disabled={creating}
                >
                  {creating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Save log
                </Button>
              </form>
            </Form>
          </div>
        </CollapsibleContent>
      </Collapsible>

     
      {/* ── entries ─────────────────────────────────────────────────────── */}
{logs.length === 0 ? (
  <p className="text-sm text-muted-foreground text-center py-4">
    No time logged yet.
  </p>
) : (
  <div className="space-y-2">
    {logs.map((log, idx) => (
      <div
        key={log._id}
        className="flex items-center gap-3 rounded-lg border bg-background p-2.5 group"
      >
        {/* avatar */}
        {log.userId.avatarUrl ? (
          <img
            src={log.userId.avatarUrl}
            alt={log.userId.name}
            className="h-8 w-8 rounded-full object-cover shrink-0 border"
          />
        ) : (
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
              avatarColor(idx)
            )}
          >
            {initials(log.userId.name)}
          </div>
        )}

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium truncate">
              {log.userId.name}
            </p>

            {log.userId.role && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {log.userId.role}
              </span>
            )}
          </div>

          {log.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {log.description}
            </p>
          )}
        </div>

        {/* hours/date */}
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">{log.hours}h</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(log.logDate), "MMM d")}
          </p>
        </div>

        {/* delete */}
        {canDeleteLog(log) && (
          <button
            onClick={() => handleDelete(log)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 ml-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    ))}
  </div>
)}
    </div>
  );
}
