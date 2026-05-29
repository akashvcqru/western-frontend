import { apiSlice } from "./apiSlice";
import type { Catalogue, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const cataloguesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogues: builder.query<
      PaginatedApiResponse<Catalogue>,
      { page?: number; limit?: number; search?: string; category?: string; status?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.search) queryParams.set("search", params.search);
          if (params.category) queryParams.set("category", params.category);
          if (params.status) queryParams.set("status", params.status);
        }
        const queryStr = queryParams.toString();
        return `/api/catalogues${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Catalogue" as const, id })),
              { type: "Catalogue", id: "LIST" },
            ]
          : [{ type: "Catalogue", id: "LIST" }],
    }),
    getCatalogueById: builder.query<ApiResponse<Catalogue>, string>({
      query: (id) => `/api/catalogues/${id}`,
      providesTags: (_, __, id) => [{ type: "Catalogue", id }],
    }),
    createCatalogue: builder.mutation<ApiResponse<Catalogue>, Partial<Catalogue>>({
      query: (body) => ({
        url: "/api/catalogues",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Catalogue", id: "LIST" }],
    }),
    updateCatalogue: builder.mutation<
      ApiResponse<Catalogue>,
      { id: string; body: Partial<Catalogue> }
    >({
      query: ({ id, body }) => ({
        url: `/api/catalogues/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Catalogue", id },
        { type: "Catalogue", id: "LIST" },
      ],
    }),
    deleteCatalogue: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/catalogues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Catalogue", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCataloguesQuery,
  useLazyGetCatalogueByIdQuery,
  useCreateCatalogueMutation,
  useUpdateCatalogueMutation,
  useDeleteCatalogueMutation,
} = cataloguesApi;
