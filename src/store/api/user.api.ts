import { baseApi } from "./baseApi";
import type { User } from "@/types/auth.types";

interface UsersResponse {
  success: boolean;
  data: User[];
}

interface UserResponse {
  success: boolean;
  data: User;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users — admin/manager only
    getUsers: builder.query<User[], void>({
      query: () => ({ url: "/users" }),
      transformResponse: (res: UsersResponse) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "User" as const, id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // GET /users/:userId
    getUser: builder.query<User, string>({
      query: (userId) => ({ url: `/users/${userId}` }),
      transformResponse: (res: UserResponse) => res.data,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    // PATCH /users/update-profile
    updateProfile: builder.mutation<User, FormData>({
      query: (body) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (res: UserResponse) => res.data,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateProfileMutation,
} = userApi;
