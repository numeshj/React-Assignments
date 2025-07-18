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
        })
    })
});

export const { useGetUserQuery, useLoginMutation, useLogoutMutation } = authApi;