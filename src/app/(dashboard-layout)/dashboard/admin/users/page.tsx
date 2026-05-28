// app/dashboard/admin/users/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

// components

// RTK
import { useGetUsersQuery } from "@/store/api/user.api";

// Redux
import { useAppSelector } from "@/store/hooks";
import type { User } from "@/types/auth.types";
import { UserFilters, UserFiltersBar } from "@/components/modules/user/UserFilters";
import { UserStats } from "@/components/modules/user/UserStats";
import { UserTable } from "@/components/modules/user/UserTable";
import { CreateUserModal } from "@/components/modules/user/CreateUserModal";
import { EditUserModal } from "@/components/modules/user/EditUserModal";
import { DeleteUserDialog } from "@/components/modules/user/DeleteUserDialog";

const DEFAULT_FILTERS: UserFilters = {
  search: "", role: "all", department: "all", status: "all",
};

export default function UsersPage() {
  const { user: me } = useAppSelector((s) => s.auth);
  const role         = me?.role ?? "member";
  const isAdmin      = role === "admin";

  const { data: users = [], isLoading } = useGetUsersQuery();

  const [filters, setFilters]       = useState<UserFilters>(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser,   setEditUser]   = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // ── client-side filter ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (filters.role       !== "all" && u.role       !== filters.role)       return false;
      if (filters.department !== "all" && u.department !== filters.department) return false;
      if (filters.status     !== "all" && u.status     !== filters.status)     return false;
      return true;
    });
  }, [users, filters]);

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k === "search" ? v !== "" : v !== "all"
  );

  return (
    <TooltipProvider>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* ── header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
              <Users className="h-5 w-5 text-muted-foreground" />
              Team management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {users.length} member{users.length !== 1 ? "s" : ""} across all departments
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="h-9">
            <UserPlus className="h-4 w-4 mr-1.5" /> Add user
          </Button>
        </div>

        {/* ── stat chips ──────────────────────────────────────────────── */}
        {isLoading
          ? <div className="flex gap-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-24 rounded-lg" />)}</div>
          : <UserStats users={users} />
        }

        {/* ── filters ─────────────────────────────────────────────────── */}
        <UserFiltersBar
          filters={filters}
          onChange={(p) => setFilters((prev) => ({ ...prev, ...p }))}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ── table ───────────────────────────────────────────────────── */}
        {isLoading
          ? <Skeleton className="h-64 rounded-xl lg:min-w-[900px]" />
          : (
            <UserTable
              users={filtered}
              currentUserId={me?._id ?? ""}
              currentUserRole={role}
              onEdit={(u) => setEditUser(u)}
              onDelete={(u) => setDeleteUser(u)}
            />
          )
        }

        {/* result count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground text-right">
            Showing {filtered.length} of {users.length} users
          </p>
        )}

      </div>

      {/* ── modals ──────────────────────────────────────────────────────── */}
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        currentUserRole={role as any}
      />

      <EditUserModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        currentUserRole={role as any}
        currentUserId={me?._id ?? ""}
      />

      <DeleteUserDialog
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
      />
    </TooltipProvider>
  );
}
