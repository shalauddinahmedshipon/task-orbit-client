// components/users/UserFilters.tsx
"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface UserFilters {
  search:     string;
  role:       string;
  department: string;
  status:     string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onChange: (partial: Partial<UserFilters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function UserFiltersBar({
  filters, onChange, onClear, hasActiveFilters,
}: UserFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* search */}
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-8 h-9 text-sm"
          placeholder="Search name or email…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* role */}
      <Select value={filters.role} onValueChange={(v) => onChange({ role: v })}>
        <SelectTrigger className="h-9 w-[120px] text-sm">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      {/* department */}
      <Select value={filters.department} onValueChange={(v) => onChange({ department: v })}>
        <SelectTrigger className="h-9 w-[140px] text-sm">
          <SelectValue placeholder="All depts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All depts</SelectItem>
          <SelectItem value="FRONTEND">Frontend</SelectItem>
          <SelectItem value="BACKEND">Backend</SelectItem>
          <SelectItem value="UI/UX">UI/UX</SelectItem>
          <SelectItem value="QA">QA</SelectItem>
          <SelectItem value="DevOps">DevOps</SelectItem>
        </SelectContent>
      </Select>

      {/* status */}
      <Select value={filters.status} onValueChange={(v) => onChange({ status: v })}>
        <SelectTrigger className="h-9 w-[120px] text-sm">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="in-progress">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5" onClick={onClear}>
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
