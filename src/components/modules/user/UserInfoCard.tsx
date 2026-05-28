import { Mail, Building2, Code2, Shield, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth.types";

const ROLE_STYLE: Record<string, string> = {
  admin:   "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400",
  manager: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400",
  member:  "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400",
};

const STATUS_STYLE: Record<string, string> = {
  "in-progress": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  "blocked":     "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

interface Props { user: User }

export function UserInfoCard({ user }: Props) {
  const colorIdx = user.name.charCodeAt(0) % AVATAR_COLORS.length;

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">

        {/* Avatar + name block */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 border-2 border-background overflow-hidden",
            !user.avatarUrl && AVATAR_COLORS[colorIdx]
          )}>
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              : initials(user.name)
            }
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{user.name}</h2>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                ROLE_STYLE[user.role]
              )}>
                {user.role}
              </span>
              <span className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                STATUS_STYLE[user.status]
              )}>
                {user.status === "in-progress" ? "Active" : "Blocked"}
              </span>
            </div>
          </div>
        </div>

        {/* Meta rows */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>{user.department ?? <span className="italic">No department</span>}</span>
          </div>

          <div className="flex items-start gap-2 text-muted-foreground">
            <Code2 className="h-4 w-4 shrink-0 mt-0.5" />
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {user.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            ) : (
              <span className="italic text-xs">No skills listed</span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
