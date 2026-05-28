// components/users/CreateUserModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
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
import { useCreateUserMutation } from "@/store/api/user.api";
import {
  createUserSchema, CreateUserInput,
  DEPARTMENTS, ROLES,
} from "@/lib/validations/user.schema";
import type { UserRole } from "@/types/auth.types";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
}

export function CreateUserModal({ open, onClose, currentUserRole }: CreateUserModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [showPwd, setShowPwd]       = useState(false);

  // managers can't create admin or other managers
  const allowedRoles = currentUserRole === "admin"
    ? ROLES
    : (["member"] as const);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "", email: "", password: "",
      role: "member", department: "FRONTEND", skills: "",
    },
  });

  const onSubmit = async (values: CreateUserInput) => {
    try {
      await createUser({
        ...values,
        skills: values.skills
          ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      }).unwrap();
      toast.success("User created — they will be prompted to change password on first login");
      form.reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full name <span className="text-red-500">*</span></FormLabel>
                <FormControl><Input placeholder="e.g. Sara Rahman" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* email */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="email" placeholder="sara@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* password */}
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Temporary password <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPwd ? "text" : "password"}
                      placeholder="Min 6 characters"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  User will be prompted to change this on first login.
                </p>
                <FormMessage />
              </FormItem>
            )} />

            {/* role + department */}
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger></FormControl>
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
                  <FormLabel>Department <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Dept" /></SelectTrigger></FormControl>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create user
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
