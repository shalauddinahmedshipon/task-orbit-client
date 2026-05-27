// components/task-detail/CommentsPanel.tsx
"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Loader2, Pencil, Send, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/store/api/comment.api";
import type { Comment } from "@/types/task-detail.types";
import { initials, avatarColor } from "@/utils/task.utils";
import { cn } from "@/lib/utils";

interface CommentsPanelProps {
  taskId: string;
  currentUserId: string;
  canManage: boolean;
}

export function CommentsPanel({ taskId, currentUserId, canManage }: CommentsPanelProps) {
  const { data: comments = [], isLoading } = useGetCommentsByTaskQuery(taskId);
  const [createComment, { isLoading: sending }] = useCreateCommentMutation();
  const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [newMsg, setNewMsg]           = useState("");
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editMsg, setEditMsg]         = useState("");

  // ── send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!newMsg.trim()) return;
    try {
      await createComment({ taskId, message: newMsg.trim() }).unwrap();
      setNewMsg("");
    } catch {
      toast.error("Failed to send comment");
    }
  };

  // ── edit ─────────────────────────────────────────────────────────────────
  const handleEdit = async (comment: Comment) => {
    if (!editMsg.trim()) return;
    try {
      await updateComment({ commentId: comment._id, message: editMsg.trim(), taskId }).unwrap();
      setEditingId(null);
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (comment: Comment) => {
    try {
      await deleteComment({ commentId: comment._id, taskId }).unwrap();
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const canEditComment = (comment: Comment) =>
    canManage || comment.userId._id === currentUserId;

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">

      {/* ── input ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5", avatarColor(0))}>
          Me
        </div>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment…"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            rows={2}
            className="resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">⌘ Enter to send</span>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!newMsg.trim() || sending}
              className="h-7 text-xs"
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              <span className="ml-1.5">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── list ────────────────────────────────────────────────────────── */}
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-4">
  {comments.map((comment, idx) => (
    <div key={comment._id} className="flex gap-3 group">

      {/* Avatar */}
      {comment.userId.avatarUrl ? (
        <img
          src={comment.userId.avatarUrl}
          alt={comment.userId.name}
          className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5"
        />
      ) : (
        <div
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5",
            avatarColor(idx)
          )}
        >
          {initials(comment.userId.name)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          
          <span className="text-sm font-medium">
            {comment.userId.name}
          </span>

          {/* Role badge */}
          {comment.userId.role && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
              {comment.userId.role}
            </span>
          )}

          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>

        {editingId === comment._id ? (
          <div className="space-y-2">
            <Textarea
              value={editMsg}
              onChange={(e) => setEditMsg(e.target.value)}
              rows={2}
              className="resize-none text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleEdit(comment)}
                disabled={updating}
              >
                {updating && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                Save
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {comment.message}
            </p>

            {canEditComment(comment) && (
              <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(comment._id);
                    setEditMsg(comment.message);
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(comment)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  ))}
</div>
      )}
    </div>
  );
}
