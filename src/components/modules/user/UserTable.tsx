// components/users/UserTable.tsx
"use client";

import { format } from "date-fns";
import {
  MoreHorizontal, Pencil, Trash2,
  ShieldCheck, ShieldAlert, User as UserIcon,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import type { User } from "@/types/auth.types";
import { initials, avatarColor } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

// ─── Role styling ─────────────────────────────────────────────────────────────

const roleVariant: Record<string, string> = {
  admin:   "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  member:  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const roleIcon: Record<string, React.ReactNode> = {
  admin:   <ShieldCheck className="h-3 w-3" />,
  manager: <ShieldAlert className="h-3 w-3" />,
  member:  <UserIcon className="h-3 w-3" />,
};

const deptVariant: Record<string, string> = {
  FRONTEND: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  BACKEND:  "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "UI/UX":  "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  QA:       "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  DevOps:   "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserTableProps {
  users: User[];
  currentUserId: string;
  currentUserRole: string;
  onEdit:   (user: User) => void;
  onDelete: (user: User) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function UserTable({
  users, currentUserId, currentUserRole, onEdit, onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center">
        <p className="text-sm text-muted-foreground">No users match your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="min-w-[220px]">User</TableHead>
              <TableHead className="w-[100px]">Role</TableHead>
              <TableHead className="w-[110px]">Department</TableHead>
              <TableHead className="min-w-[140px]">Skills</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[110px]">Joined</TableHead>
              <TableHead className="w-[52px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, idx) => {
              const isBlocked  = user.status === "blocked";
              const isSelf     = user._id === currentUserId;
              const canDelete  = currentUserRole === "admin" && !isSelf && user.role !== "admin";
              const canEdit    = !isSelf || currentUserRole === "admin";

              return (
                <TableRow key={user._id} className={cn("group", isBlocked && "opacity-60")}>

                  {/* avatar + name + email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className={cn("text-[10px] font-semibold", avatarColor(idx))}>
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          {isSelf && (
                            <span className="text-[10px] text-muted-foreground border rounded px-1">you</span>
                          )}
                          {user.needsPasswordChange && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded px-1">
                              must change pwd
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* role */}
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      roleVariant[user.role]
                    )}>
                      {roleIcon[user.role]}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>

                  {/* department */}
                  <TableCell>
                    {user.department ? (
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        deptVariant[user.department] ?? "bg-muted text-muted-foreground"
                      )}>
                        {user.department}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* skills */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {user.skills && user.skills.length > 0 ? (
                        <>
                          {user.skills.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] border rounded px-1.5 py-0.5 text-muted-foreground bg-muted/40"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{user.skills.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* status */}
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      isBlocked
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    )}>
                      {isBlocked ? "Blocked" : "Active"}
                    </span>
                  </TableCell>

                  {/* joined */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "MMM d, yyyy")
                        : "—"}
                    </span>
                  </TableCell>

                  {/* actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
