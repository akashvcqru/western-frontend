import { apiSlice } from "./apiSlice";
import type { Service, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<
      PaginatedApiResponse<Service>,
      { page?: number; limit?: number; category?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.category) queryParams.set("category", params.category);
          if (params.search) queryParams.set("search", params.search);
        }
        const queryStr = queryParams.toString();
        return `/api/services${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Service" as const, id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),
    getAdminServices: builder.query<
      PaginatedApiResponse<Service>,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.search) queryParams.set("search", params.search);
        }
        const queryStr = queryParams.toString();
        return `/api/services/admin${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Service" as const, id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),
    createService: builder.mutation<ApiResponse<Service>, Partial<Service>>({
      query: (body) => ({
        url: "/api/services/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
    updateService: builder.mutation<
      ApiResponse<Service>,
      { id: string; body: Partial<Service> }
    >({
      query: ({ id, body }) => ({
        url: `/api/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Service", id },
        { type: "Service", id: "LIST" },
      ],
    }),
    deleteService: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetAdminServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
