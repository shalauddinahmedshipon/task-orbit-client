// components/users/DeleteUserDialog.tsx
"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUserMutation } from "@/store/api/user.api";
import type { User } from "@/types/auth.types";

interface DeleteUserDialogProps {
  user: User | null;
  onClose: () => void;
}

export function DeleteUserDialog({ user, onClose }: DeleteUserDialogProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleConfirm = async () => {
    if (!user) return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success(`${user.name} deleted`);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete user");
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>"{user?.name}"</strong> ({user?.email}) will be permanently
            removed. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <Trash2 className="mr-2 h-4 w-4" />
            }
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
