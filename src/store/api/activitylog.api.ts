// store/api/activitylog.api.ts
import { baseApi } from "./baseApi";
import type { ActivityLog } from "@/types/task-detail.types";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogsByTask: builder.query<ActivityLog[], string>({
      query: (taskId) => ({ url: `/activity-log/task/${taskId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, taskId) => [{ type: "ActivityLog" as const, id: taskId }],
    }),
  }),
});

export const { useGetActivityLogsByTaskQuery } = activityLogApi;