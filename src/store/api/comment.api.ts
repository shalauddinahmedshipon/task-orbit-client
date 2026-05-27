// store/api/comment.api.ts
import { baseApi } from "./baseApi";
import type { Comment } from "@/types/task-detail.types";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByTask: builder.query<Comment[], string>({
      query: (taskId) => ({ url: `/comments/task/${taskId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, taskId) => [{ type: "Comment" as const, id: taskId }],
    }),
    createComment: builder.mutation<Comment, { taskId: string; message: string }>({
      query: ({ taskId, message }) => ({
        url: `/comments/task/${taskId}`,
        method: "POST",
        body: { message },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Comment", id: taskId }],
    }),
    updateComment: builder.mutation<Comment, { commentId: string; message: string; taskId: string }>({
      query: ({ commentId, message }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { message },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Comment", id: taskId }],
    }),
    deleteComment: builder.mutation<void, { commentId: string; taskId: string }>({
      query: ({ commentId }) => ({ url: `/comments/${commentId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Comment", id: taskId }],
    }),
  }),
});

export const {
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;