"use client";

import { useState } from "react";
import { UserPlus, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useAddProjectMembersMutation,
  useRemoveProjectMemberMutation,
} from "@/store/api/project.api";

import type { Project, ProjectMember } from "@/types/project.types";
import { useGetUsersQuery } from "@/store/api/user.api";
import { getInitials } from "@/utils/project.utils";

const ROLE_COLORS: Record<string, string> = {
  admin:
    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  manager:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  member:
    "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
];

interface Props {
  project: Project;
  canManage: boolean;
}

export function ProjectMembersPanel({ project, canManage }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [addMembers, { isLoading: adding }] = useAddProjectMembersMutation();
  const [removeMember, { isLoading: removing }] = useRemoveProjectMemberMutation();

  // All users for the add dropdown — exclude already-members
  const { data: allUsers = [] } = useGetUsersQuery(undefined, { skip: !addOpen });
  const memberIds = new Set(project.members.map((m) => m._id));
  const nonMembers = allUsers.filter((u: any) => !memberIds.has(u._id));

  const handleAdd = async () => {
    if (!selectedUserId) return;
    try {
      await addMembers({
        projectId: project._id,
        memberIds: [selectedUserId],
      }).unwrap();
      toast.success("Member added");
      setSelectedUserId("");
      setAddOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add member");
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember({ projectId: project._id, memberId }).unwrap();
      toast.success("Member removed");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to remove member");
    }
  };

  return (
    <div className="rounded-xl border bg-card">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <p className="text-sm font-semibold">Team Members</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {project.members.length} member{project.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canManage && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-xs"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </div>

      {/* Member list */}
      <div className="divide-y">
        {project.members.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            No members assigned yet.
          </p>
        )}
        {project.members.map((member, i) => (
          <MemberRow
            key={member._id}
            member={member}
            colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
            roleColor={ROLE_COLORS[member.role] ?? ROLE_COLORS.member}
            canRemove={canManage}
            isRemoving={removing}
            onRemove={() => handleRemove(member._id)}
          />
        ))}
      </div>

      {/* Add member dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Select a team member to add to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member…" />
              </SelectTrigger>
              <SelectContent>
                {nonMembers.length === 0 && (
                  <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                    All users are already members.
                  </p>
                )}
                {nonMembers.map((u: any) => (
                  <SelectItem key={u._id} value={u._id}>
                    {u.name} — {u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddOpen(false)} disabled={adding}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={adding || !selectedUserId}
              >
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Sub-component ────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: ProjectMember;
  colorClass: string;
  roleColor: string;
  canRemove: boolean;
  isRemoving: boolean;
  onRemove: () => void;
}

function MemberRow({
  member,
  colorClass,
  roleColor,
  canRemove,
  onRemove,
}: MemberRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 group">
      {/* Avatar */}
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}
      >
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="rounded-full object-cover h-full w-full"
          />
        ) : (
          getInitials(member.name)
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{member.name}</p>
        <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
          <Mail className="h-2.5 w-2.5 shrink-0" />
          {member.email}
        </p>
      </div>

      {/* Role badge */}
      <span
        className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${roleColor}`}
      >
        {member.role}
      </span>

      {/* Remove */}
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          title={`Remove ${member.name}`}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
