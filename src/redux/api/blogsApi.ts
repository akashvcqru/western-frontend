import { apiSlice } from "./apiSlice";
import type { BlogPost, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const blogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<
      PaginatedApiResponse<BlogPost>,
      { page?: number; limit?: number; search?: string; category?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.search) queryParams.set("search", params.search);
          if (params.category) queryParams.set("category", params.category);
        }
        const queryStr = queryParams.toString();
        return `/api/blogs${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "BlogPost" as const, id })),
              { type: "BlogPost", id: "LIST" },
            ]
          : [{ type: "BlogPost", id: "LIST" }],
    }),
    getBlogByIdOrSlug: builder.query<ApiResponse<BlogPost>, string>({
      query: (idOrSlug) => `/api/blogs/${idOrSlug}`,
      providesTags: (_, __, idOrSlug) => [{ type: "BlogPost", id: idOrSlug }],
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogByIdOrSlugQuery } = blogsApi;
