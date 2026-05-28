// store/api/user.api.ts
import { baseApi } from "./baseApi";
import type { User } from "@/types/auth.types";

// ─── Payload types ────────────────────────────────────────────────────────────

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "member";
  department: "FRONTEND" | "BACKEND" | "UI/UX" | "QA" | "DevOps";
  skills?: string[];
}

export interface UpdateUserByAdminPayload {
  name?: string;
  role?: "admin" | "manager" | "member";
  department?: "FRONTEND" | "BACKEND" | "UI/UX" | "QA" | "DevOps";
  skills?: string[];
  status?: "in-progress" | "blocked";
}

// ─── API slice ────────────────────────────────────────────────────────────────

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /users  — admin/manager sees all
    getUsers: builder.query<User[], void>({
      query: () => ({ url: "/users" }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "User" as const, id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // GET /users/my-profile
    getMyProfile: builder.query<User, void>({
      query: () => ({ url: "/users/my-profile" }),
      transformResponse: (res: any) => res.data,
      providesTags: [{ type: "User", id: "ME" }],
    }),

    // GET /users/:userId
    getUser: builder.query<User, string>({
      query: (userId) => ({ url: `/users/${userId}` }),
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    // POST /users/create-user  — admin/manager
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/users/create-user",
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // PATCH /users/update-profile  — any role, multipart (avatar upload)
    updateProfile: builder.mutation<User, FormData>({
      query: (body) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body,
        formData: true,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: [{ type: "User", id: "ME" }, { type: "User", id: "LIST" }],
    }),

    // PATCH /users/:userId  — admin/manager
    updateUserByAdmin: builder.mutation<User, { userId: string; data: UpdateUserByAdminPayload }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    // DELETE /users/:userId  — admin only
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMyProfileQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateProfileMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserMutation,
} = userApi;
