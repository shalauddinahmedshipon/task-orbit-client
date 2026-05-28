"use client";

import {  Settings, User } from "lucide-react";
import { useGetMyProfileQuery } from "@/store/api/user.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileForm } from "@/components/modules/user/ProfileForm";
import { ChangePasswordForm } from "@/components/modules/user/ChangePasswordForm";
import { SkillsInfoCard } from "@/components/modules/user/SkillsInfoCard";

export default function SettingsPage() {
  const { data: profile, isLoading, isError } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Failed to load profile. Please refresh.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences
          </p>
        </div>
      </div>

      {/* Profile — name + avatar */}
      <ProfileForm user={profile} />

      {/* Password */}
      <ChangePasswordForm/>

      {/* Skills / department — read-only, admin-managed */}
     {profile.role!="admin"&&profile.role!="manager"&&<SkillsInfoCard user={profile} />} 

    </div>
  );
}
