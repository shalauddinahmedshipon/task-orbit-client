// store/api/report.api.ts
import { ProjectReport, UserReport } from "@/types/report.types";
import { baseApi } from "./baseApi";


export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /reports/me — any role
    getMyReport: builder.query<UserReport, void>({
      query: () => ({ url: "/reports/me" }),
      transformResponse: (res: any) => res.data,
      providesTags: [{ type: "Report" as const, id: "ME" }],
    }),

    // GET /reports/user/:userId — admin/manager only
    getUserReport: builder.query<UserReport, string>({
      query: (userId) => ({ url: `/reports/user/${userId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, userId) => [{ type: "Report" as const, id: userId }],
    }),

    // GET /reports/project/:projectId — admin/manager only
    getProjectReport: builder.query<ProjectReport, string>({
      query: (projectId) => ({ url: `/reports/project/${projectId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Report" as const, id: id }],
    }),
  }),
});

export const {
  useGetMyReportQuery,
  useGetUserReportQuery,
  useGetProjectReportQuery,
} = reportApi;