"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/store/api/task.api";
import { Task, TaskAssignee } from "@/types/task.types";
import { TaskFormInput, taskSchema } from "@/lib/validations/task.schema";
import { ProjectMember } from "@/types/project.types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  projectId: string;
  sprintId: string;
  allMembers: ProjectMember[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TaskFormModal({
  open,
  onClose,
  task,
  projectId,
  sprintId,
  allMembers,
}: TaskFormModalProps) {
  const isEdit = !!task;
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const isLoading = creating || updating;

  // ✅ Explicit generic <TaskFormInput> fixes Control<> and SubmitHandler<> type errors
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema) as any, // 'as any' only on resolver to avoid zod version drift
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      estimatedHours: undefined,
      dueDate: "",
      assignees: [],
      reviewApproval: false,
    },
  });

  // Pre-fill when editing
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours,
        dueDate: task.dueDate?.split("T")[0] ?? "",
        assignees: task.assignees.map((a) => a._id),
        reviewApproval: task.reviewApproval,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        estimatedHours: undefined,
        dueDate: "",
        assignees: [],
        reviewApproval: false,
      });
    }
  }, [task, open]);

  // ✅ Typed as SubmitHandler<TaskFormInput> — no more parameter incompatibility error
  const onSubmit: SubmitHandler<TaskFormInput> = async (values) => {
    try {
      if (isEdit && task) {
        await updateTask({ id: task._id, data: { ...values, sprintId } }).unwrap();
        toast.success("Task updated");
      } else {
        await createTask({
          projectId,
          data: { ...values, sprintId, projectId },
        }).unwrap();
        toast.success("Task created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "Create task"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Implement kanban board" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Task details and acceptance criteria…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* priority + status */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* due date + estimated hours */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.5}
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* assignees */}
            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {allMembers.map((m) => {
                      const selected = field.value?.includes(m._id);
                      return (
                        <button
                          type="button"
                          key={m._id}
                          onClick={() => {
                            const cur = field.value ?? [];
                            field.onChange(
                              selected
                                ? cur.filter((id) => id !== m._id)
                                : [...cur, m._id]
                            );
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-primary/60"
                          }`}
                        >
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* review approval toggle */}
            <FormField
              control={form.control}
              name="reviewApproval"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-sm">Require manager approval</FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Task must be approved before moving to Done
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Create task"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}