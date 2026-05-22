import { apiSlice } from "./apiSlice";
import type { Brand, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<
      PaginatedApiResponse<Brand>,
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
        return `/api/brands${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Brand" as const, id })),
              { type: "Brand", id: "LIST" },
            ]
          : [{ type: "Brand", id: "LIST" }],
    }),
    createBrand: builder.mutation<ApiResponse<Brand>, Partial<Brand>>({
      query: (body) => ({
        url: "/api/brands",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
    updateBrand: builder.mutation<
      ApiResponse<Brand>,
      { id: string; body: Partial<Brand> }
    >({
      query: ({ id, body }) => ({
        url: `/api/brands/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
    }),
    deleteBrand: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
