// services/auth.service.ts
import { apiSlice } from "./base-query";
import type { User } from "@/types/user";

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /login
    login: builder.mutation<
      | { token: string; user: User }
      | ApiEnvelope<{ token: string; user: User }>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // setelah login, tandai data /me sebagai stale
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    // POST /logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // setelah logout, tandai data /me sebagai stale
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    // GET /me
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      // terima dua kemungkinan bentuk response: langsung User atau amplop { code, message, data }
      transformResponse: (res: User | ApiEnvelope<User>) =>
        "data" in res ? res.data : res,
      keepUnusedDataFor: 300,
      // ✅ gunakan tag yang sudah terdaftar di apiSlice (mis. "User")
      providesTags: (res) =>
        res?.id != null
          ? [
              { type: "User" as const, id: "ME" },
              { type: "User" as const, id: res.id },
            ]
          : [{ type: "User" as const, id: "ME" }],
    }),

    // ✅ UPDATE User Info using FormData (PUT via POST + _method=PUT)
    updateMe: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: "/me?_method=PUT",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: User;
      }) => response.data,
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery, useUpdateMeMutation } = authApi;