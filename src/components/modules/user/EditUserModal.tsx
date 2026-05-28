// components/users/EditUserModal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateUserByAdminMutation } from "@/store/api/user.api";
import {
  updateUserByAdminSchema, UpdateUserByAdminInput,
  DEPARTMENTS, ROLES,
} from "@/lib/validations/user.schema";
import type { User, UserRole } from "@/types/auth.types";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  currentUserRole: UserRole;
  currentUserId: string;
}

export function EditUserModal({
  open, onClose, user, currentUserRole, currentUserId,
}: EditUserModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserByAdminMutation();

  // roles that the current user can assign
  const allowedRoles = currentUserRole === "admin"
    ? ROLES
    : (["member"] as const);

  const form = useForm<UpdateUserByAdminInput>({
    resolver: zodResolver(updateUserByAdminSchema),
    defaultValues: {
      name: "", role: "member", department: "FRONTEND",
      skills: "", status: "in-progress",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name:       user.name,
        role:       user.role,
        department: user.department,
        skills:     user.skills?.join(", ") ?? "",
        status:     user.status,
      });
    }
  }, [user, open]);

  const onSubmit = async (values: UpdateUserByAdminInput) => {
    if (!user) return;
    try {
      await updateUser({
        userId: user._id,
        data: {
          ...values,
          skills: values.skills
            ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        },
      }).unwrap();
      toast.success("User updated");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update user");
    }
  };

  const isSelf   = user?._id === currentUserId;
  const isAdmin  = user?.role === "admin";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit user — {user?.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* role + department */}
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSelf || (isAdmin && currentUserRole !== "admin")}
                  >
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {allowedRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* skills */}
            <FormField control={form.control} name="skills" render={({ field }) => (
              <FormItem>
                <FormLabel>Skills <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span></FormLabel>
                <FormControl>
                  <Input placeholder="React, TypeScript, Node.js" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* blocked toggle — can't block self */}
            {!isSelf && (
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-sm">Block user</FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Blocked users cannot log in
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "blocked"}
                      onCheckedChange={(v) => field.onChange(v ? "blocked" : "in-progress")}
                    />
                  </FormControl>
                </FormItem>
              )} />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
