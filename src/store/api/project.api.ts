import { baseApi } from "./baseApi";
import type {
  Project,
  ProjectsResponse,
  ProjectsQueryParams,
  CreateProjectPayload,
} from "@/types/project.types";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /projects —  filterable
   getProjects: builder.query<Project[], ProjectsQueryParams>({
  query: (params = {}) => {
    const search = new URLSearchParams();

    if (params.status) {
      search.set("status", params.status);
    }

    if (params.client) {
      search.set("client", params.client);
    }

    if (params.search) {
      search.set("search", params.search);
    }

    return {
      url: `/projects?${search.toString()}`,
    };
  },

  transformResponse: (res: ProjectsResponse) => res.data,

  providesTags: (result) =>
    result
      ? [
          ...result.map(({ _id }) => ({
            type: "Project" as const,
            id: _id,
          })),
          { type: "Project" as const, id: "LIST" },
        ]
      : [{ type: "Project" as const, id: "LIST" }],
}),

    // GET /projects/:projectId
    getProject: builder.query<Project, string>({
      query: (projectId) => ({ url: `/projects/${projectId}` }),
      transformResponse: (res: { data: Project }) => res.data,
      providesTags: (_result, _err, id) => [{ type: "Project", id }],
    }),

    // POST /projects
    createProject: builder.mutation<Project, FormData>({
      query: (formData) => ({
        url: "/projects",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: { data: Project }) => res.data,
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    // PATCH /projects/:projectId
    updateProject: builder.mutation<
      Project,
      { projectId: string; body: FormData }
    >({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: { data: Project }) => res.data,
      invalidatesTags: (_result, _err, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
    }),

    // DELETE /projects/:projectId
    deleteProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    // POST /projects/:projectId/members
    addProjectMembers: builder.mutation<
      Project,
      { projectId: string; memberIds: string[] }
    >({
      query: ({ projectId, memberIds }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { memberIds },
      }),
      transformResponse: (res: { data: Project }) => res.data,
      invalidatesTags: (_result, _err, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),

    // DELETE /projects/:projectId/members/:memberId
    removeProjectMember: builder.mutation<
      void,
      { projectId: string; memberId: string }
    >({
      query: ({ projectId, memberId }) => ({
        url: `/projects/${projectId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddProjectMembersMutation,
  useRemoveProjectMemberMutation,
} = projectApi;