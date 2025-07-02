import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../../app/api/baseApi';
import type { ResponseDto } from '../../../app/models/responseDto';
import { toast } from 'react-toastify';
import Apis from '../../../app/api/Apis';
import type { Brand } from '../../../app/models/product/filter/brand';
import type { CreateBrandSchema } from '../../../lib/schemas/createBrandSchema';

export const brandApi = createApi({
  // Define a unique name for the API slice
  reducerPath: 'brandApi',
  // Specify the base query function to use for API requests
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  // Define the types of tags that this API will use
  tagTypes: ['Brands'],
  // Define the API endpoints
  endpoints: (builder) => ({
    fetchBrands: builder.query<ResponseDto<Brand[]>, void>({
      query: () => Apis.API_TAILER.BRAND,
      providesTags: ['Brands']
    }),
    createBrand: builder.mutation<ResponseDto<Brand>, CreateBrandSchema>({
      query: (brand) => ({
        url: Apis.API_TAILER.BRAND,
        method: Apis.API_TYPE.POST,
        body: brand
      }),
      onQueryStarted: async (brand, { dispatch, queryFulfilled }) => {
        // Approach 1: Invalidate the brands cache to refetch after creating a new brand
        //dispatch(brandApi.util.invalidateTags(['Brands']));

        // Approach 2:
        // Optimistically update the cache with a temporary brand
        // This allows the UI to update immediately while waiting for the server response
        const patchResult = dispatch(
          brandApi.util.updateQueryData('fetchBrands', undefined, (draft) => {
            // Optimistically update the cache with a new brand
            draft.result.push({
              brandId: 0, // Temporary ID, will be replaced by the server
              name: brand.name
            });
          })
        );

        try {
          // Wait for the server response
          const { data } = await queryFulfilled;
          // If the response indicates failure, undo the optimistic update
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to create brand');
            return;
          }

          // Replace the temporary ID with the actual ID returned from the server
          const newBrand = data.result;
          // Update the cache again to replace the temporary brand with the real one
          dispatch(
            brandApi.util.updateQueryData('fetchBrands', undefined, (draft) => {
              const index = draft.result.findIndex((b) => b.brandId === 0);
              if (index !== -1) {
                draft.result[index] = newBrand;
              }
            })
          );
          // Successfully created the brand, show success message
          toast.success('Created brand successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo();
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    updateBrand: builder.mutation<ResponseDto<Brand>, Brand>({
      query: (brand) => ({
        url: Apis.API_TAILER.BRAND,
        method: Apis.API_TYPE.PUT,
        body: brand
      }),
      onQueryStarted: async (brand, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          brandApi.util.updateQueryData('fetchBrands', undefined, (draft) => {
            // Optimistically update the cache with the updated brand
            const index = draft.result.findIndex(
              (b) => b.brandId === brand.brandId
            );
            if (index !== -1) {
              draft.result[index] = {
                ...draft.result[index],
                ...brand
              };
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to update brand');
            return;
          }
          toast.success('Updated brand successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo(); // Undo the optimistic update if the request fails
          throw error;
        }
      }
    }),
    deleteBrand: builder.mutation<ResponseDto<Brand>, number>({
      query: (id) => ({
        url: `${Apis.API_TAILER.BRAND}/${id}`,
        method: Apis.API_TYPE.DELETE
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          brandApi.util.updateQueryData('fetchBrands', undefined, (draft) => {
            // Optimistically remove the brand from the cache
            draft.result = draft.result.filter((b) => b.brandId !== id);
          })
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to delete brand');
            return;
          }
          toast.success('Deleted brand successfully');
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
  useFetchBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} = brandApi;
