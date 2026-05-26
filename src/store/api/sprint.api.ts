import { baseApi } from "./baseApi";
import type {
  Sprint,
  CreateSprintPayload,
  UpdateSprintPayload,
  SprintsQueryParams,
} from "@/types/sprint.types";

interface SprintsResponse {
  success: boolean;
  data: Sprint[];
}

interface SprintResponse {
  success: boolean;
  data: Sprint;
}

export const sprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /sprints?projectId=xxx  — sorted by order asc
    getSprints: builder.query<Sprint[], SprintsQueryParams>({
      query: ({ projectId } = {}) => {
        const qs = projectId ? `?projectId=${projectId}` : "";
        return { url: `/sprints${qs}` };
      },
      transformResponse: (res: SprintsResponse) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Sprint" as const, id: _id })),
              { type: "Sprint", id: "LIST" },
            ]
          : [{ type: "Sprint", id: "LIST" }],
    }),

    // GET /sprints/:sprintId
    getSprint: builder.query<Sprint, string>({
      query: (sprintId) => ({ url: `/sprints/${sprintId}` }),
      transformResponse: (res: SprintResponse) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Sprint", id }],
    }),

    // POST /sprints
    createSprint: builder.mutation<Sprint, CreateSprintPayload>({
      query: (body) => ({ url: "/sprints", method: "POST", body }),
      transformResponse: (res: SprintResponse) => res.data,
      invalidatesTags: [{ type: "Sprint", id: "LIST" }],
    }),

    // PATCH /sprints/:sprintId
    updateSprint: builder.mutation<
      Sprint,
      { sprintId: string; body: UpdateSprintPayload }
    >({
      query: ({ sprintId, body }) => ({
        url: `/sprints/${sprintId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: SprintResponse) => res.data,
      invalidatesTags: (_r, _e, { sprintId }) => [
        { type: "Sprint", id: sprintId },
        { type: "Sprint", id: "LIST" },
      ],
    }),

    // DELETE /sprints/:sprintId
    deleteSprint: builder.mutation<void, string>({
      query: (sprintId) => ({ url: `/sprints/${sprintId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Sprint", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSprintsQuery,
  useGetSprintQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintApi;