"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteSprintMutation } from "@/store/api/sprint.api";
import type { Sprint } from "@/types/sprint.types";

interface Props {
  sprint: Sprint | null;
  onClose: () => void;
}

export function DeleteSprintDialog({ sprint, onClose }: Props) {
  const [deleteSprint, { isLoading }] = useDeleteSprintMutation();

  const handleDelete = async () => {
    if (!sprint) return;
    try {
      await deleteSprint(sprint._id).unwrap();
      toast.success("Sprint deleted");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete sprint");
    }
  };

  return (
    <AlertDialog open={!!sprint} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete sprint?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-semibold text-foreground">{sprint?.title}</span>{" "}
            and all tasks inside it. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
