import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../../app/api/baseApi';
import type { ResponseDto } from '../../../app/models/responseDto';
import { toast } from 'react-toastify';
import Apis from '../../../app/api/Apis';
import type { Category } from '../../../app/models/product/filter/category';
import type { CreateCategorySchema } from '../../../lib/schemas/createCategorySchema';

export const categoryApi = createApi({
  // Define a unique name for the API slice
  reducerPath: 'categoryApi',
  // Specify the base query function to use for API requests
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  // Define the types of tags that this API will use
  tagTypes: ['Categories'],
  // Define the API endpoints
  endpoints: (builder) => ({
    fetchCategories: builder.query<ResponseDto<Category[]>, void>({
      query: () => Apis.API_TAILER.CATEGORY,
      providesTags: ['Categories']
    }),
    createCategory: builder.mutation<
      ResponseDto<Category>,
      CreateCategorySchema
    >({
      query: (category) => ({
        url: Apis.API_TAILER.CATEGORY,
        method: Apis.API_TYPE.POST,
        body: category
      }),
      onQueryStarted: async (category, { dispatch, queryFulfilled }) => {
        // Approach 1: Invalidate the categories cache to refetch after creating a new category
        //dispatch(categoryApi.util.invalidateTags(['Categories']));

        // Approach 2:
        // Optimistically update the cache with a temporary category
        // This allows the UI to update immediately while waiting for the server response
        const patchResult = dispatch(
          categoryApi.util.updateQueryData(
            'fetchCategories',
            undefined,
            (draft) => {
              // Optimistically update the cache with a new category
              draft.result.push({
                categoryId: 0, // Temporary ID, will be replaced by the server
                name: category.name
              });
            }
          )
        );

        try {
          // Wait for the server response
          const { data } = await queryFulfilled;
          // If the response indicates failure, undo the optimistic update
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to create category');
            return;
          }

          // Replace the temporary ID with the actual ID returned from the server
          const newCategory = data.result;
          // Update the cache again to replace the temporary category with the real one
          dispatch(
            categoryApi.util.updateQueryData(
              'fetchCategories',
              undefined,
              (draft) => {
                const index = draft.result.findIndex((c) => c.categoryId === 0);
                if (index !== -1) {
                  draft.result[index] = newCategory;
                }
              }
            )
          );
          // Successfully created the category, show success message
          toast.success('Created category successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo();
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    updateCategory: builder.mutation<ResponseDto<Category>, Category>({
      query: (category) => ({
        url: Apis.API_TAILER.CATEGORY,
        method: Apis.API_TYPE.PUT,
        body: category
      }),
      onQueryStarted: async (category, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          categoryApi.util.updateQueryData(
            'fetchCategories',
            undefined,
            (draft) => {
              // Optimistically update the cache with the updated category
              const index = draft.result.findIndex(
                (c) => c.categoryId === category.categoryId
              );
              if (index !== -1) {
                draft.result[index] = {
                  ...draft.result[index],
                  ...category
                };
              }
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to update category');
            return;
          }
          toast.success('Updated category successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo(); // Undo the optimistic update if the request fails
          throw error;
        }
      }
    }),
    deleteCategory: builder.mutation<ResponseDto<Category>, number>({
      query: (id) => ({
        url: `${Apis.API_TAILER.CATEGORY}/${id}`,
        method: Apis.API_TYPE.DELETE
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          categoryApi.util.updateQueryData(
            'fetchCategories',
            undefined,
            (draft) => {
              // Optimistically remove the category from the cache
              draft.result = draft.result.filter((c) => c.categoryId !== id);
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to delete category');
            return;
          }
          toast.success('Deleted category successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo(); // Undo the optimistic update if the request fails
          throw error;
        }
      }
    })
  })
});

export const {
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
