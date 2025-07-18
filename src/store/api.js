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
        })
    })
});

export const { useGetUserQuery } = authApi;