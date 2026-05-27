import { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from "@/types/task.types";
import { baseApi } from "./baseApi";

interface GetTasksParams {
  sprintId?: string;
  projectId?: string;
  assignee?: string;
  status?: TaskStatus;
  priority?: string;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<Task[], GetTasksParams>({
     query: (params) => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== "" &&
          value !== "all"
      )
    );

    return {
      url: "/tasks",
      params: cleanedParams,
    };
  },
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task" as const, id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getSingleTask: builder.query<Task, string>({
      query: (taskId) => ({ url: `/tasks/${taskId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Task", id }],
    }),

    createTask: builder.mutation<Task, { projectId: string; data: CreateTaskPayload }>({
      query: ({ projectId, data }) => ({
        url: `/tasks/project/${projectId}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskPayload }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    updateTaskStatus: builder.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    approveTask: builder.mutation<Task, { id: string; approved: boolean }>({
      query: ({ id, approved }) => ({
        url: `/tasks/${id}/approve`,
        method: "PATCH",
        body: { approved },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // POST /tasks/:taskId/attachments  — multipart/form-data
    addAttachment: builder.mutation<Task, { taskId: string; file: File }>({
      query: ({ taskId, file }) => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `/tasks/${taskId}/attachments`,
          method: "POST",
          body: form,
          // Do NOT set Content-Type — browser sets it with the correct boundary
          formData: true,
        };
      },
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    // DELETE /tasks/:taskId/attachments  — sends publicId in body
    deleteAttachment: builder.mutation<Task, { taskId: string; publicId: string }>({
      query: ({ taskId, publicId }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: "DELETE",
        body: { publicId },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetSingleTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useApproveTaskMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useDeleteTaskMutation,
} = taskApi;