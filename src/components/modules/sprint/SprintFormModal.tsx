// components/sprint-detail/SprintFormModal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import {
  useCreateSprintMutation,
  useUpdateSprintMutation,
} from "@/store/api/sprint.api";
import type { Sprint } from "@/types/sprint.types";

const sprintSchema = z
  .object({
    title:     z.string().min(1, "Title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate:   z.string().min(1, "End date is required"),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type SprintFormInput = z.infer<typeof sprintSchema>;

interface SprintFormModalProps {
  open: boolean;
  onClose: () => void;
  sprint?: Sprint | null;
  projectId: string;
}

export function SprintFormModal({
  open,
  onClose,
  sprint,
  projectId,
}: SprintFormModalProps) {
  const isEdit = !!sprint;
  const [createSprint, { isLoading: creating }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: updating }] = useUpdateSprintMutation();
  const isLoading = creating || updating;

  const form = useForm<SprintFormInput>({
    resolver: zodResolver(sprintSchema),
    defaultValues: { title: "", startDate: "", endDate: "" },
  });

  useEffect(() => {
    if (sprint) {
      form.reset({
        title:     sprint.title,
        startDate: sprint.startDate?.split("T")[0] ?? "",
        endDate:   sprint.endDate?.split("T")[0]   ?? "",
      });
    } else {
      form.reset();
    }
  }, [sprint, open]);

  const onSubmit = async (values: SprintFormInput) => {
    try {
      if (isEdit && sprint) {
        await updateSprint({sprintId: sprint._id, body: values }).unwrap();
        toast.success("Sprint updated");
      } else {
        await createSprint({ ...values, projectId }).unwrap();
        toast.success("Sprint created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit sprint" : "Create sprint"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Sprint title <span className="text-red-500">*</span></FormLabel>
                <FormControl><Input placeholder="e.g. Sprint 3 · Auth & Tasks" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date <span className="text-red-500">*</span></FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End date <span className="text-red-500">*</span></FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Create sprint"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
