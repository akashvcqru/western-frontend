import { apiSlice } from "./apiSlice";
import type { GalleryItem, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query<
      PaginatedApiResponse<GalleryItem>,
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
        return `/api/gallery${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "GalleryItem" as const, id })),
              { type: "GalleryItem", id: "LIST" },
            ]
          : [{ type: "GalleryItem", id: "LIST" }],
    }),
    createGalleryItem: builder.mutation<ApiResponse<GalleryItem>, Partial<GalleryItem>>({
      query: (body) => ({
        url: "/api/gallery",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "GalleryItem", id: "LIST" }],
    }),
    deleteGalleryItem: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/api/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GalleryItem", id: "LIST" }],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApi;
