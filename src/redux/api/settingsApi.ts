import { apiSlice } from "./apiSlice";
import type { ApiResponse } from "@/types/api";

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettingsByKey: builder.query<ApiResponse<any>, string>({
      query: (key) => `/api/settings/${key}`,
      providesTags: (result, error, key) => [{ type: "Settings", id: key }],
      keepUnusedDataFor: 0, // Ensure we don't serve stale cached settings
    }),
  }),
});

export const { useGetSettingsByKeyQuery } = settingsApi;
