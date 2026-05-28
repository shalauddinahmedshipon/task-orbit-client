// // components/sprint-detail/TaskTable.tsx
// "use client";

// import { useRouter } from "next/navigation";
// import {
//   AlertTriangle,
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   ExternalLink,
//   Plus,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";


// import { cn } from "@/lib/utils";
// import { Task } from "@/types/task.types";
// import { formatDate, isOverdue, priorityDot, priorityVariant, statusLabel, statusVariant, subtaskProgress } from "@/utils/task.utils";
// import { AssigneeStack } from "../sprint/AssigneeStack";

// interface TaskTableProps {
//   tasks: Task[];
//   canManage: boolean;
//   onEdit: (task: Task) => void;
//   onDelete: (task: Task) => void;
//   onAddTask: () => void;
// }

// export function TaskTable({
//   tasks,
//   canManage,
//   onEdit,
//   onDelete,
//   onAddTask,
// }: TaskTableProps) {
//   const router = useRouter();

//   if (tasks.length === 0) {
//     return (
//       <div className="rounded-xl border border-dashed bg-muted/30 py-16 flex flex-col items-center gap-3 text-center">
//         <p className="text-sm text-muted-foreground">No tasks match your filters.</p>
//         {canManage && (
//           <Button size="sm" variant="outline" onClick={onAddTask}>
//             <Plus className="h-3.5 w-3.5 mr-1.5" /> Add first task
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl border overflow-hidden">
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/40 hover:bg-muted/40">
//               <TableHead className="w-8">
//                 <input type="checkbox" className="rounded border-muted" />
//               </TableHead>
//               <TableHead className="min-w-[200px]">Task</TableHead>
//               <TableHead className="min-w-[100px]">Assignees</TableHead>
//               <TableHead className="w-[90px]">Priority</TableHead>
//               <TableHead className="w-[110px]">Status</TableHead>
//               <TableHead className="w-[90px]">Subtasks</TableHead>
//               <TableHead className="w-[70px]">Est.</TableHead>
//               <TableHead className="w-[90px]">Due</TableHead>
//               {canManage && <TableHead className="w-[60px]" />}
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {tasks.map((task) => {
//               const overdue  = isOverdue(task.dueDate, task.status);
//               const subPct   = subtaskProgress(task.subtasks);
//               const isDone   = task.status === "done";

//               return (
//                 <TableRow
//                   key={task._id}
//                   className={cn("cursor-pointer group", isDone && "opacity-60")}
//                   onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
//                 >
//                   {/* checkbox */}
//                   <TableCell onClick={(e) => e.stopPropagation()}>
//                     <input type="checkbox" checked={isDone} readOnly className="rounded border-muted" />
//                   </TableCell>

//                   {/* title */}
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <span className={cn("h-2 w-2 rounded-full shrink-0", priorityDot[task.priority])} />
//                       <span className={cn("text-sm font-medium line-clamp-1", isDone && "line-through text-muted-foreground")}>
//                         {task.title}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* assignees */}
//                   <TableCell>
//                     <AssigneeStack assignees={task.assignees} max={3} />
//                   </TableCell>

//                   {/* priority */}
//                   <TableCell>
//                     <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", priorityVariant[task.priority])}>
//                       {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
//                     </span>
//                   </TableCell>

//                   {/* status */}
//                   <TableCell>
//                     <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusVariant[task.status])}>
//                       {statusLabel[task.status]}
//                     </span>
//                   </TableCell>

//                   {/* subtasks */}
//                   <TableCell>
//                     {task.subtasks.length > 0 ? (
//                       <div className="flex items-center gap-1.5 min-w-[60px]">
//                         <Progress value={subPct} className="h-1.5 flex-1" />
//                         <span className="text-xs text-muted-foreground whitespace-nowrap">
//                           {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
//                         </span>
//                       </div>
//                     ) : (
//                       <span className="text-xs text-muted-foreground">—</span>
//                     )}
//                   </TableCell>

//                   {/* estimated hours */}
//                   <TableCell>
//                     <span className="text-xs text-muted-foreground">{task.estimatedHours}h</span>
//                   </TableCell>

//                   {/* due date */}
//                   <TableCell>
//                     <span className={cn("flex items-center gap-1 text-xs whitespace-nowrap", overdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
//                       {overdue && <AlertTriangle className="h-3 w-3" />}
//                       {formatDate(task.dueDate)}
//                     </span>
//                   </TableCell>

//                   {/* actions */}
//                   {canManage && (
//                     <TableCell onClick={(e) => e.stopPropagation()}>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-7 w-7 opacity-0 group-hover:opacity-100"
//                           >
//                             <MoreHorizontal className="h-3.5 w-3.5" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
//                           >
//                             <ExternalLink className="mr-2 h-3.5 w-3.5" /> View details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => onEdit(task)}>
//                             <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => onDelete(task)}
//                             className="text-red-600 focus:text-red-600"
//                           >
//                             <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>

//       {/* add task inline row */}
//       {canManage && (
//         <button
//           onClick={onAddTask}
//           className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground border-t hover:bg-muted/40 transition-colors"
//         >
//           <Plus className="h-4 w-4" /> Add task to this sprint…
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Task } from "@/types/task.types";

import {
  formatDate,
  isOverdue,
  priorityDot,
  priorityVariant,
  statusLabel,
  statusVariant,
  subtaskProgress,
} from "@/utils/task.utils";

import { AssigneeStack } from "../sprint/AssigneeStack";

interface TaskTableProps {
  tasks: Task[];
  canManage: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddTask: () => void;
}

export function TaskTable({
  tasks,
  canManage,
  onEdit,
  onDelete,
  onAddTask,
}: TaskTableProps) {
  const router = useRouter();

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 py-16 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          No tasks match your filters.
        </p>

        {canManage && (
          <Button size="sm" variant="outline" onClick={onAddTask}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add first task
          </Button>
        )}
      </div>
    );
  }

  const taskPath = (id: string) =>
    `/dashboard/admin/tasks/${id}`;

  return (
    <>
      {/* ───────────────── Mobile Cards ───────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {tasks.map((task) => {
          const overdue = isOverdue(task.dueDate, task.status);
          const subPct = subtaskProgress(task.subtasks);
          const isDone = task.status === "done";

          return (
            <div
              key={task._id}
              onClick={() => router.push(taskPath(task._id))}
              className={cn(
                "rounded-xl border bg-card p-3 cursor-pointer transition-colors active:bg-muted/40",
                isDone && "opacity-60"
              )}
            >
              {/* top */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0 mt-1.5",
                      priorityDot[task.priority]
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug line-clamp-2",
                        isDone &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {/* priority */}
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          priorityVariant[task.priority]
                        )}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>

                      {/* status */}
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          statusVariant[task.status]
                        )}
                      >
                        {statusLabel[task.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* actions */}
                {canManage && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(taskPath(task._id))
                          }
                        >
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          View details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onEdit(task)}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(task)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* middle */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <AssigneeStack
                  assignees={task.assignees}
                  max={3}
                />

                <span className="text-xs text-muted-foreground">
                  {task.estimatedHours}h est.
                </span>
              </div>

              {/* subtasks */}
              {task.subtasks.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Progress
                    value={subPct}
                    className="h-1.5 flex-1"
                  />

                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {
                      task.subtasks.filter(
                        (s) => s.isComplete
                      ).length
                    }
                    /{task.subtasks.length}
                  </span>
                </div>
              )}

              {/* footer */}
              <div className="flex items-center justify-between mt-3">
                <span
                  className={cn(
                    "flex items-center gap-1 text-[11px]",
                    overdue
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {overdue && (
                    <AlertTriangle className="h-3 w-3" />
                  )}

                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          );
        })}

        {/* mobile add task */}
        {canManage && (
          <button
            onClick={onAddTask}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-muted/40 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add task to this sprint
          </button>
        )}
      </div>

      {/* ───────────────── Desktop Table ───────────────── */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-8">
                  <input
                    type="checkbox"
                    className="rounded border-muted"
                  />
                </TableHead>

                <TableHead className="min-w-[220px]">
                  Task
                </TableHead>

                <TableHead className="min-w-[100px]">
                  Assignees
                </TableHead>

                <TableHead className="w-[90px]">
                  Priority
                </TableHead>

                <TableHead className="w-[110px]">
                  Status
                </TableHead>

                <TableHead className="min-w-[110px]">
                  Subtasks
                </TableHead>

                <TableHead className="w-[70px]">
                  Est.
                </TableHead>

                <TableHead className="w-[90px]">
                  Due
                </TableHead>

                {canManage && (
                  <TableHead className="w-[60px]" />
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => {
                const overdue = isOverdue(
                  task.dueDate,
                  task.status
                );

                const subPct = subtaskProgress(
                  task.subtasks
                );

                const isDone = task.status === "done";

                return (
                  <TableRow
                    key={task._id}
                    className={cn(
                      "cursor-pointer group",
                      isDone && "opacity-60"
                    )}
                    onClick={() =>
                      router.push(taskPath(task._id))
                    }
                  >
                    {/* checkbox */}
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        readOnly
                        className="rounded border-muted"
                      />
                    </TableCell>

                    {/* title */}
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0",
                            priorityDot[task.priority]
                          )}
                        />

                        <span
                          className={cn(
                            "text-sm font-medium truncate max-w-[220px] block",
                            isDone &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* assignees */}
                    <TableCell>
                      <AssigneeStack
                        assignees={task.assignees}
                        max={3}
                      />
                    </TableCell>

                    {/* priority */}
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          priorityVariant[task.priority]
                        )}
                      >
                        {task.priority
                          .charAt(0)
                          .toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </TableCell>

                    {/* status */}
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                          statusVariant[task.status]
                        )}
                      >
                        {statusLabel[task.status]}
                      </span>
                    </TableCell>

                    {/* subtasks */}
                    <TableCell>
                      {task.subtasks.length > 0 ? (
                        <div className="flex items-center gap-1.5 min-w-[80px]">
                          <Progress
                            value={subPct}
                            className="h-1.5 flex-1"
                          />

                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {
                              task.subtasks.filter(
                                (s) => s.isComplete
                              ).length
                            }
                            /{task.subtasks.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* est */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {task.estimatedHours}h
                      </span>
                    </TableCell>

                    {/* due */}
                    <TableCell>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs whitespace-nowrap",
                          overdue
                            ? "text-red-500 font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {overdue && (
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                        )}

                        {formatDate(task.dueDate)}
                      </span>
                    </TableCell>

                    {/* actions */}
                    {canManage && (
                      <TableCell
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  taskPath(task._id)
                                )
                              }
                            >
                              <ExternalLink className="mr-2 h-3.5 w-3.5" />
                              View details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onEdit(task)}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                onDelete(task)
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* desktop add task */}
        {canManage && (
          <button
            onClick={onAddTask}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground border-t hover:bg-muted/40 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add task to this sprint…
          </button>
        )}
      </div>
    </>
  );
}
