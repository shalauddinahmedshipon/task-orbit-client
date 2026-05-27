// store/api/timelog.api.ts
import { baseApi } from "./baseApi";
import type { TimeLog } from "@/types/task-detail.types";

export const timeLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimeLogsByTask: builder.query<TimeLog[], string>({
      query: (taskId) => ({ url: `/time-log/task/${taskId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, taskId) => [{ type: "TimeLog" as const, id: taskId }],
    }),
    getMyTimeLogs: builder.query<TimeLog[], void>({
      query: () => ({ url: "/time-log/my" }),
      transformResponse: (res: any) => res.data,
      providesTags: [{ type: "TimeLog", id: "MY" }],
    }),
    createTimeLog: builder.mutation<
      TimeLog,
      { taskId: string; hours: number; logDate: string; description?: string }
    >({
      query: ({ taskId, ...body }) => ({
        url: `/time-log/task/${taskId}`,
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [
        { type: "TimeLog", id: taskId },
        { type: "TimeLog", id: "MY" },
      ],
    }),
    updateTimeLog: builder.mutation<
      TimeLog,
      { logId: string; taskId: string; hours?: number; logDate?: string; description?: string }
    >({
      query: ({ logId, taskId, ...body }) => ({
        url: `/time-log/${logId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "TimeLog", id: taskId }],
    }),
    deleteTimeLog: builder.mutation<void, { logId: string; taskId: string }>({
      query: ({ logId }) => ({ url: `/time-log/${logId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: "TimeLog", id: taskId }],
    }),
  }),
});

export const {
  useGetTimeLogsByTaskQuery,
  useGetMyTimeLogsQuery,
  useCreateTimeLogMutation,
  useUpdateTimeLogMutation,
  useDeleteTimeLogMutation,
} = timeLogApi;