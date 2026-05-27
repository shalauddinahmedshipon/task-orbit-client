// components/sprint-detail/KanbanBoard.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useUpdateTaskMutation, useUpdateTaskStatusMutation } from "@/store/api/task.api";
import { cn } from "@/lib/utils";
import { KANBAN_COLUMNS, KanbanColumn, Task, TaskStatus } from "@/types/task.types";
import { KanbanCard } from "./KanbanCard";

interface KanbanBoardProps {
  tasks: Task[];
  userRole: "admin" | "manager" | "member";
  canManage: boolean;
  onAddTask: () => void;
}

// Group tasks by status column
function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const map: Record<TaskStatus, Task[]> = {
    "todo":        [],
    "in-progress": [],
    "review":      [],
    "done":        [],
  };
  for (const t of tasks) {
    map[t.status]?.push(t);
  }
  return map;
}

export function KanbanBoard({ tasks, userRole, canManage, onAddTask }: KanbanBoardProps) {
  // Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
  setLocalTasks(tasks);
}, [tasks]);
  // Sync when server tasks change (e.g. after refetch)
  // if (tasks !== localTasks && !localTasks.some((lt) => lt._id === tasks[0]?._id)) {
  //   setLocalTasks(tasks);
  // }

  const [updateTask]       = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const columns = groupByStatus(localTasks);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId) return;

      const from = source.droppableId as TaskStatus;
      const to   = destination.droppableId as TaskStatus;

      // Block: Review → Done requires manager approval
      // if (from === "review" && to === "done") {
      //   toast.warning("Admin/Manager approval required — use the task detail page to approve.");
      //   return;
      // }

      // Block: members cannot move to done directly
      if (userRole === "member" && to === "done") {
        toast.warning("Tasks must go through Review before Done.");
        return;
      }

      // Optimistic update
      const prevTasks = localTasks;
      setLocalTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? { ...t, status: to } : t))
      );

      try {
        if (userRole === "member") {
          await updateTaskStatus({ id: draggableId, status: to }).unwrap();
        } else {
          await updateTask({ id: draggableId, data: { status: to } }).unwrap();
        }
        toast.success(`Moved to ${to.replace("-", " ")}`);
      } catch {
        // Revert on failure
        setLocalTasks(prevTasks);
        toast.error("Failed to update task status. Please try again.");
      }
    },
    [localTasks, userRole, updateTask, updateTaskStatus]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KANBAN_COLUMNS.map((col: KanbanColumn) => {
          const colTasks  = columns[col.id] ?? [];
          const taskCount = colTasks.length;

          return (
            <div key={col.id} className="flex flex-col min-w-0">
              {/* column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", col.dotColor)} />
                  <span className="text-sm font-medium">{col.label}</span>
                </div>
                <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5 bg-background">
                  {taskCount}
                </span>
              </div>

              {/* droppable column */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl p-2 min-h-[120px] transition-colors",
                      col.color,
                      snapshot.isDraggingOver &&
                        "ring-2 ring-primary/40 ring-offset-1"
                    )}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard
                              task={task}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {/* empty state */}
                    {taskCount === 0 && !snapshot.isDraggingOver && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Drop tasks here
                      </p>
                    )}
                  </div>
                )}
              </Droppable>

            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
