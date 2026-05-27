// "use client";

// import { useRef } from "react";
// import { toast } from "sonner";
// import {
//   FileText, Paperclip, Upload, CheckSquare,
//   Image as ImageIcon, Trash2, Loader2,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import {
//   useUpdateTaskMutation,
//   useAddAttachmentMutation,
//   useDeleteAttachmentMutation,
// } from "@/store/api/task.api";
// import type { Task, Attachment } from "@/types/task.types";
// import { subtaskProgress } from "@/utils/task.utils";
// import { cn } from "@/lib/utils";

// interface TaskBodyProps {
//   task: Task;
//   canManage?: boolean;
//   userRole?: "admin" | "manager" | "member";
// }

// export function TaskBody({ task, canManage }: TaskBodyProps) {
//   const [updateTask,       { isLoading }]          = useUpdateTaskMutation();
//   const [addAttachment,    { isLoading: uploading }] = useAddAttachmentMutation();
//   const [deleteAttachment, { isLoading: deleting }]  = useDeleteAttachmentMutation();
//   const fileRef = useRef<HTMLInputElement>(null);

//   // ── subtask toggle ────────────────────────────────────────────────────────
//   const toggleSubtask = async (idx: number) => {
//     const updated = task.subtasks.map((s, i) =>
//       i === idx ? { ...s, isComplete: !s.isComplete } : s
//     );
//     try {
//       await updateTask({ id: task._id, data: { subtasks: updated } }).unwrap();
//     } catch {
//       toast.error("Failed to update subtask");
//     }
//   };

//   // ── file upload ───────────────────────────────────────────────────────────
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const maxMb = 10;
//     if (file.size > maxMb * 1024 * 1024) {
//       toast.error(`File too large — max ${maxMb} MB`);
//       return;
//     }

//     try {
//       await addAttachment({ taskId: task._id, file }).unwrap();
//       toast.success("Attachment uploaded");
//     } catch {
//       toast.error("Upload failed");
//     } finally {
//       // reset so the same file can be re-selected if needed
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   // ── delete attachment ─────────────────────────────────────────────────────
//   const handleDeleteAttachment = async (publicId: string) => {
//     try {
//       await deleteAttachment({ taskId: task._id, publicId }).unwrap();
//       toast.success("Attachment removed");
//     } catch {
//       toast.error("Failed to remove attachment");
//     }
//   };

//   const subPct  = subtaskProgress(task.subtasks);
//   const subDone = task.subtasks.filter((s) => s.isComplete).length;

//   return (
//     <div className="space-y-5">

//       {/* ── description ───────────────────────────────────────────────── */}
//       <div className="rounded-xl border bg-card p-4 sm:p-5">
//         <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
//           <FileText className="h-4 w-4 text-muted-foreground" /> Description
//         </h3>
//         {task.description ? (
//           <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
//             {task.description}
//           </p>
//         ) : (
//           <p className="text-sm text-muted-foreground italic">No description provided.</p>
//         )}
//       </div>

//       {/* ── subtasks ──────────────────────────────────────────────────── */}
//       {task.subtasks.length > 0 && (
//         <div className="rounded-xl border bg-card p-4 sm:p-5">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="flex items-center gap-2 text-sm font-medium">
//               <CheckSquare className="h-4 w-4 text-muted-foreground" />
//               Subtasks
//               <span className="text-muted-foreground font-normal">
//                 ({subDone}/{task.subtasks.length})
//               </span>
//             </h3>
//           </div>

//           <Progress value={subPct} className="h-1.5 mb-4" />

//           <div className="space-y-1">
//             {task.subtasks.map((sub, i) => (
//               <label
//                 key={sub._id ?? i}
//                 className={cn(
//                   "flex items-center gap-3 py-2 px-1 rounded-lg cursor-pointer",
//                   "hover:bg-muted/50 transition-colors"
//                 )}
//               >
//                 <input
//                   type="checkbox"
//                   checked={sub.isComplete}
//                   onChange={() => toggleSubtask(i)}
//                   className="h-4 w-4 rounded border-muted-foreground/30 accent-primary"
//                   disabled={isLoading}
//                 />
//                 <span className={cn(
//                   "text-sm flex-1",
//                   sub.isComplete && "line-through text-muted-foreground"
//                 )}>
//                   {sub.title}
//                 </span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── attachments ───────────────────────────────────────────────── */}
//       <div className="rounded-xl border bg-card p-4 sm:p-5">
//         <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
//           <Paperclip className="h-4 w-4 text-muted-foreground" />
//           Attachments
//           {task.attachments.length > 0 && (
//             <span className="text-xs text-muted-foreground font-normal">
//               ({task.attachments.length})
//             </span>
//           )}
//         </h3>

//         {task.attachments.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
//             {task.attachments.map((att) => (
//               <AttachmentItem
//                 key={att.publicId}
//                 attachment={att}
//                 canDelete={canManage}
//                 onDelete={() => handleDeleteAttachment(att.publicId)}
//                 deleting={deleting}
//               />
//             ))}
//           </div>
//         )}

//         {/* hidden file input */}
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*,.pdf"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         {/* upload zone */}
//         <button
//           onClick={() => fileRef.current?.click()}
//           disabled={uploading}
//           className={cn(
//             "w-full flex items-center gap-3 rounded-lg border border-dashed p-3 text-sm transition-colors",
//             uploading
//               ? "border-primary/40 bg-muted/40 cursor-not-allowed text-muted-foreground"
//               : "border-border text-muted-foreground hover:bg-muted/40 hover:border-primary/40"
//           )}
//         >
//           {uploading
//             ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
//             : <Upload className="h-4 w-4 shrink-0" />
//           }
//           <span>{uploading ? "Uploading…" : "Click to upload or drag & drop · PDF or image · max 10 MB"}</span>
//         </button>
//       </div>

//     </div>
//   );
// }

// // ─── Attachment item ──────────────────────────────────────────────────────────

// interface AttachmentItemProps {
//   attachment: Attachment;
//   canDelete: boolean;
//   onDelete: () => void;
//   deleting: boolean;
// }

// function AttachmentItem({
//   attachment,
//   canDelete,
//   onDelete,
//   deleting,
// }: AttachmentItemProps) {
//   const isPdf =
//     attachment.type === "application/pdf" ||
//     attachment.fileName.endsWith(".pdf");

//   return (
//     <div className="flex items-center gap-3 rounded-lg border bg-background p-2.5 group">
//       <a
//         href={attachment.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
//       >
//         <div
//           className={cn(
//             "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
//             isPdf
//               ? "bg-red-50 dark:bg-red-950/30"
//               : "bg-blue-50 dark:bg-blue-950/30"
//           )}
//         >
//           {isPdf ? (
//             <FileText className="h-4 w-4 text-red-500" />
//           ) : (
//             <ImageIcon className="h-4 w-4 text-blue-500" />
//           )}
//         </div>

//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-medium truncate">
//             {attachment.fileName}
//           </p>
//           <p className="text-xs text-muted-foreground">
//             {attachment.size}
//           </p>
//         </div>
//       </a>

//       {canDelete && (
//         <button
//           type="button"
//           onClick={(e) => {
//             e.preventDefault();
//             onDelete();
//           }}
//           disabled={deleting}
//           className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 shrink-0 ml-1"
//           title="Remove attachment"
//         >
//           {deleting ? (
//             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//           ) : (
//             <Trash2 className="h-3.5 w-3.5" />
//           )}
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import { toast } from "sonner";
import {
  FileText,
  Paperclip,
  Upload,
  CheckSquare,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

import {
  useUpdateTaskStatusMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
} from "@/store/api/task.api";

import type { Task, Attachment } from "@/types/task.types";
import { subtaskProgress } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface TaskBodyProps {
  task: Task;
  canManage?: boolean;
}

export function TaskBody({ task }: TaskBodyProps) {
  const [updateStatus, { isLoading: updating }] =
    useUpdateTaskStatusMutation();

  const [addAttachment, { isLoading: uploading }] =
    useAddAttachmentMutation();

  const [deleteAttachment, { isLoading: deleting }] =
    useDeleteAttachmentMutation();

  const fileRef = useRef<HTMLInputElement>(null);

  // ── SUBTASK TOGGLE (FIXED) ─────────────────────────────
  const toggleSubtask = async (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s._id === subtaskId
        ? { _id: s._id!, isComplete: !s.isComplete }
        : { _id: s._id!, isComplete: s.isComplete }
    );

    try {
      await updateStatus({
        id: task._id,
        subtasks: updatedSubtasks,
      }).unwrap();

      toast.success("Subtask updated");
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  // ── FILE UPLOAD ───────────────────────────────────────
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxMb = 10;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`File too large — max ${maxMb} MB`);
      return;
    }

    try {
      await addAttachment({
        taskId: task._id,
        file,
      }).unwrap();

      toast.success("Attachment uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ── DELETE ATTACHMENT (ALL ROLES) ─────────────────────
  const handleDeleteAttachment = async (publicId: string) => {
    try {
      await deleteAttachment({
        taskId: task._id,
        publicId,
      }).unwrap();

      toast.success("Attachment removed");
    } catch {
      toast.error("Failed to remove attachment");
    }
  };

  const subPct = subtaskProgress(task.subtasks);
  const subDone = task.subtasks.filter((s) => s.isComplete).length;

  return (
    <div className="space-y-5">

      {/* DESCRIPTION */}
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Description
        </h3>

        {task.description ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description provided.
          </p>
        )}
      </div>

      {/* SUBTASKS */}
      {task.subtasks.length > 0 && (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            Subtasks ({subDone}/{task.subtasks.length})
          </h3>

          <Progress value={subPct} className="h-1.5 mb-4" />

          <div className="space-y-1">
            {task.subtasks.map((sub) => (
              <label
                key={sub._id}
                className={cn(
                  "flex items-center gap-3 py-2 px-1 rounded-lg cursor-pointer",
                  "hover:bg-muted/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={sub.isComplete}
                  onChange={() => toggleSubtask(sub._id!)}
                  disabled={updating}
                  className="h-4 w-4 accent-primary"
                />

                <span
                  className={cn(
                    "text-sm flex-1",
                    sub.isComplete &&
                      "line-through text-muted-foreground"
                  )}
                >
                  {sub.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ATTACHMENTS */}
      <div className="rounded-xl border bg-card p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          Attachments ({task.attachments.length})
        </h3>

        {task.attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {task.attachments.map((att) => (
              <AttachmentItem
                key={att.publicId}
                attachment={att}
                onDelete={() =>
                  handleDeleteAttachment(att.publicId)
                }
                deleting={deleting}
              />
            ))}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg border border-dashed p-3 text-sm",
            uploading && "opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload attachment
        </button>
      </div>
    </div>
  );
}


function AttachmentItem({
  attachment,
  onDelete,
  deleting,
}: {
  attachment: Attachment;
  onDelete: () => void;
  deleting: boolean;
}) {
  const isPdf =
    attachment.type === "application/pdf" ||
    attachment.fileName.endsWith(".pdf");

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-2.5 group">
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80"
      >
        <div
          className={cn(
            "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
            isPdf
              ? "bg-red-50 dark:bg-red-950/30"
              : "bg-blue-50 dark:bg-blue-950/30"
          )}
        >
          {isPdf ? (
            <FileText className="h-4 w-4 text-red-500" />
          ) : (
            <ImageIcon className="h-4 w-4 text-blue-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">
            {attachment.fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            {attachment.size}
          </p>
        </div>
      </a>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}