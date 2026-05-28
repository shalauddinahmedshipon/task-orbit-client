"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Building2 } from "lucide-react";
import type { User } from "@/types/auth.types";

interface Props {
  user: User;
}

// Skills and department are admin-managed (PATCH /users/:userId)
// Members see them read-only here; admin can edit from the user detail page
export function SkillsInfoCard({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skills &amp; Department</CardTitle>
        <CardDescription>
          Managed by your admin. Contact your admin to update these.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Building2 className="h-3.5 w-3.5" /> Department
          </div>
          <p className="text-sm font-medium">
            {user.department ?? (
              <span className="text-muted-foreground italic">Not assigned</span>
            )}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Code2 className="h-3.5 w-3.5" /> Skills
          </div>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
