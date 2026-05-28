"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChangePasswordMutation, useLogoutMutation } from "@/store/api/auth.api";
import { changePasswordSchema, ChangePasswordInput } from "@/lib/validations/settings.schema";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/auth.slice"

export function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
    const router = useRouter()
      const dispatch = useAppDispatch()
     const [logoutApi, { isLoading:isLogoutLoading }] = useLogoutMutation()
  const form = useForm<ChangePasswordInput, unknown, ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<ChangePasswordInput> = async (values) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      form.reset();
     
       try {
            await logoutApi(undefined).unwrap()
          } catch (err) {
            // even if API fails, force logout on client
            console.error("Logout failed", err)
          } finally {
            dispatch(logoutAction())
            router.replace("/login")
          }
       
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to change password");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change Password</CardTitle>
        <CardDescription>
          Enter your current password then choose a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Current password */}
            <FormField control={form.control} name="oldPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showOld ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* New password */}
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Confirm */}
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
