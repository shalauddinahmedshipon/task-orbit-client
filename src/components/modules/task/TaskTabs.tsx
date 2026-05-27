// components/task-detail/TaskTabs.tsx
"use client";
import { MessageSquare, Activity, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsPanel } from "./CommentsPanel";
import { ActivityPanel } from "./ActivityPanel";
import { TimeLogPanel } from "./TimeLogPanel";

interface TaskTabsProps {
  taskId: string;
  currentUserId: string;
  canManage: boolean;
}

export function TaskTabs({ taskId, currentUserId, canManage }: TaskTabsProps) {
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <Tabs defaultValue="comments">
        <TabsList className="mb-4 h-8">
          <TabsTrigger value="comments" className="text-xs gap-1.5 h-7">
            <MessageSquare className="h-3.5 w-3.5" /> Comments
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs gap-1.5 h-7">
            <Activity className="h-3.5 w-3.5" /> Activity
          </TabsTrigger>
          <TabsTrigger value="timelog" className="text-xs gap-1.5 h-7">
            <Clock className="h-3.5 w-3.5" /> Time log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="mt-0">
          <CommentsPanel
            taskId={taskId}
            currentUserId={currentUserId}
            canManage={canManage}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <ActivityPanel taskId={taskId} />
        </TabsContent>

        <TabsContent value="timelog" className="mt-0">
          <TimeLogPanel
            taskId={taskId}
            currentUserId={currentUserId}
            canManage={canManage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
