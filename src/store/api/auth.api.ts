// store/api/auth.api.ts
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => ({
        user: response.data.user,
        needsPasswordChange: response.data.needsPasswordChange,
      }),
    }),

    getMe: builder.query({
      query: () => ({ url: "/auth/get-me", method: "GET" }),
      transformResponse: (response: any) => response.data,
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    // PATCH /auth/change-password
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;