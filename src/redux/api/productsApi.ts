import { apiSlice } from "./apiSlice";
import type { Product, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedApiResponse<Product>,
      { page?: number; limit?: number; search?: string; category?: string; brand?: string; status?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.search) queryParams.set("search", params.search);
          if (params.category) queryParams.set("category", params.category);
          if (params.brand) queryParams.set("brand", params.brand);
          if (params.status) queryParams.set("status", params.status);
        }
        const queryStr = queryParams.toString();
        return `/api/products${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductByIdOrSlug: builder.query<ApiResponse<Product>, string>({
      query: (idOrSlug) => `/api/products/${idOrSlug}`,
      providesTags: (result, error, idOrSlug) => [{ type: "Product", id: idOrSlug }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdOrSlugQuery,
} = productsApi;
