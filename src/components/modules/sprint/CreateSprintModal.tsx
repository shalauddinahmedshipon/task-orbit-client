"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { toast } from "sonner";
import {
  createSprintSchema,
  CreateSprintInput,
} from "@/lib/validations/sprint.schema";
import {
  useCreateSprintMutation,
  useUpdateSprintMutation,
} from "@/store/api/sprint.api";
import type { Sprint } from "@/types/sprint.types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projectId: string;
  editSprint?: Sprint | null;
}

export function CreateSprintModal({
  open,
  onOpenChange,
  projectId,
  editSprint,
}: Props) {
  const isEdit = !!editSprint;
  const [createSprint, { isLoading: creating }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: updating }] = useUpdateSprintMutation();
  const isLoading = creating || updating;

  const form = useForm<CreateSprintInput>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: { title: "", startDate: "", endDate: "" },
  });

  useEffect(() => {
    if (editSprint) {
      form.reset({
        title: editSprint.title,
        startDate: editSprint.startDate.slice(0, 10),
        endDate: editSprint.endDate.slice(0, 10),
      });
    } else {
      form.reset({ title: "", startDate: "", endDate: "" });
    }
  }, [editSprint, form]);

  const onSubmit = async (values: CreateSprintInput) => {
    try {
      if (isEdit && editSprint) {
        await updateSprint({ sprintId: editSprint._id, body: values }).unwrap();
        toast.success("Sprint updated");
      } else {
        await createSprint({ ...values, projectId }).unwrap();
        toast.success("Sprint created");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Sprint" : "New Sprint"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the sprint details."
              : "Add a new sprint to this project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sprint Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Design System & Foundations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Sprint"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
