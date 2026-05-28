"use client";

import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProfileMutation } from "@/store/api/user.api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations/settings.schema";
import type { User as UserType } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface Props {
  user: UserType;
}

export function ProfileForm({ user }: Props) {
  const dispatch        = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileRef         = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]       = useState<File | null>(null);

  const form = useForm<UpdateProfileInput, unknown, UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) { toast.error("Image too large — max 4 MB"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit: SubmitHandler<UpdateProfileInput> = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (file) formData.append("avatar", file);

    try {
      const updated = await updateProfile(formData).unwrap();
      // keep redux auth slice in sync
      dispatch(setCredentials({ user: updated }));
      toast.success("Profile updated");
      setFile(null);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update profile");
    }
  };

  const avatarSrc = preview ?? user.avatarUrl;
  const initials  = user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
        <CardDescription>Update your display name and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Avatar picker */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className={cn(
                  "h-16 w-16 rounded-full border-2 border-border overflow-hidden",
                  "flex items-center justify-center bg-muted text-muted-foreground text-lg font-semibold",
                )}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                    : initials
                  }
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>

              <div className="text-xs text-muted-foreground space-y-0.5">
                <p className="font-medium text-sm text-foreground">{user.name}</p>
                <p>{user.email}</p>
                <p className="capitalize">{user.role} · {user.department ?? "No department"}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-primary hover:underline mt-1"
                >
                  Change avatar
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Read-only fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input value={user.email} disabled className="bg-muted/40 text-muted-foreground" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Role</label>
                <Input value={user.role} disabled className="bg-muted/40 text-muted-foreground capitalize" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
