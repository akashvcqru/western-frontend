import { apiSlice } from "./apiSlice";
import type { Category, SubCategory, PaginatedApiResponse, ApiResponse } from "@/types/api";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      PaginatedApiResponse<Category>,
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
        return `/api/categories${queryStr ? `?${queryStr}` : ""}`;
      },
      transformResponse: (response: PaginatedApiResponse<Category>) => {
        if (response?.data) {
          response.data = response.data.map((cat) => ({
            ...cat,
            image: cat.image?.startsWith("/uploads/")
              ? `https://westernofficesolutions.com${cat.image}`
              : cat.image,
          }));
        }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (body) => ({
        url: "/api/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; body: Partial<Category> }
    >({
      query: ({ id, body }) => ({
        url: `/api/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    getSubCategories: builder.query<
      PaginatedApiResponse<SubCategory>,
      { page?: number; limit?: number; search?: string; categoryId?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.set("page", String(params.page));
          if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
          if (params.search) queryParams.set("search", params.search);
          if (params.categoryId) queryParams.set("categoryId", params.categoryId);
        }
        const queryStr = queryParams.toString();
        return `/api/categories/subcategories${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "SubCategory" as const, id })),
              { type: "SubCategory", id: "LIST" },
            ]
          : [{ type: "SubCategory", id: "LIST" }],
    }),
    createSubCategory: builder.mutation<ApiResponse<SubCategory>, Partial<SubCategory>>({
      query: (body) => ({
        url: "/api/categories/subcategories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
    }),
    updateSubCategory: builder.mutation<
      ApiResponse<SubCategory>,
      { id: string; body: Partial<SubCategory> }
    >({
      query: ({ id, body }) => ({
        url: `/api/categories/subcategories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "SubCategory", id },
        { type: "SubCategory", id: "LIST" },
      ],
    }),
    deleteSubCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/api/categories/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
    }),
    reorderCategories: builder.mutation<ApiResponse<null>, { id: string; position: number }[]>({
      query: (body) => ({
        url: "/api/categories/reorder",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    reorderSubCategories: builder.mutation<ApiResponse<null>, { id: string; position: number }[]>({
      query: (body) => ({
        url: "/api/categories/subcategories/reorder",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useReorderCategoriesMutation,
  useReorderSubCategoriesMutation,
} = categoriesApi;
