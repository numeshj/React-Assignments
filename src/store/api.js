import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://auth.dnjs.lk/api"
    }),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (token) => ({
                url: "/user",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }),
        logout: builder.mutation({
            query: (token) => ({
                url: "/logout",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }),
        updateUser: builder.mutation({
            query: ({ token, name, description }) => ({
                url: "/user",
                method: "PUT",
                body: { name, description },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
        }),
        uploadAvatar: builder.mutation({
            query: ({ token, formData }) => ({
                url: "/avatar",
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }),
        removeAvatar: builder.mutation({
            query: (token) => ({
                url: "/avatar",
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }),
        changePassword: builder.mutation({
            query: ({ token, old_password, new_password, new_password_confirmation }) => ({
                url: "/password",
                method: "PUT",
                body: { old_password, new_password, new_password_confirmation },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
        }),
        changeEmail: builder.mutation({
            query: ({ token, email }) => ({
                url: `/email?token=${token}`,
                method: "POST",
                body: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
        })
    })
});

export const { 
    useGetUserQuery, 
    useLoginMutation, 
    useLogoutMutation,
    useUpdateUserMutation,
    useUploadAvatarMutation,
    useRemoveAvatarMutation,
    useChangePasswordMutation,
    useChangeEmailMutation
} = authApi;