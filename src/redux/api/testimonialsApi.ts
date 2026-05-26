import { apiSlice } from "./apiSlice";
import type { Testimonial, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const testimonialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<
      PaginatedApiResponse<Testimonial>,
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
        return `/api/testimonials${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Testimonial" as const, id })),
              { type: "Testimonial", id: "LIST" },
            ]
          : [{ type: "Testimonial", id: "LIST" }],
    }),
    getAdminTestimonials: builder.query<
      PaginatedApiResponse<Testimonial>,
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
        return `/api/testimonials/admin${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Testimonial" as const, id })),
              { type: "Testimonial", id: "LIST" },
            ]
          : [{ type: "Testimonial", id: "LIST" }],
    }),
    createTestimonial: builder.mutation<ApiResponse<Testimonial>, Partial<Testimonial>>({
      query: (body) => ({
        url: "/api/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
    createAdminTestimonial: builder.mutation<ApiResponse<Testimonial>, Partial<Testimonial>>({
      query: (body) => ({
        url: "/api/testimonials/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
    updateTestimonial: builder.mutation<
      ApiResponse<Testimonial>,
      { id: string; body: Partial<Testimonial> }
    >({
      query: ({ id, body }) => ({
        url: `/api/testimonials/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Testimonial", id },
        { type: "Testimonial", id: "LIST" },
      ],
    }),
    deleteTestimonial: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useCreateAdminTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
