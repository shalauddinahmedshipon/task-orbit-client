import { cn } from "@/lib/utils";
import type { ProjectMember } from "@/types/project.types";
import { getInitials } from "@/utils/project.utils";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
];

interface Props {
  members: ProjectMember[];
  max?: number;
  size?: "sm" | "md";
}

export function MemberAvatars({ members, max = 4, size = "sm" }: Props) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  const dimension = size === "sm" ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]";

  return (
    <div className="flex items-center">
      {visible.map((member, i) => (
        <div
          key={member._id}
          title={member.name}
          className={cn(
            "rounded-full border-2 border-background flex items-center justify-center font-semibold shrink-0",
            dimension,
            AVATAR_COLORS[i % AVATAR_COLORS.length],
            i > 0 && "-ml-1.5"
          )}
        >
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            getInitials(member.name)
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "rounded-full border-2 border-background bg-muted text-muted-foreground flex items-center justify-center font-semibold -ml-1.5 shrink-0",
            dimension
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
