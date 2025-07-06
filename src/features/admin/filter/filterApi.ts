import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../../app/api/baseApi';
import type { ResponseDto } from '../../../app/models/responseDto';
import { toast } from 'react-toastify';
import Apis from '../../../app/api/Apis';
import type {
  Filter,
  FilterInput
} from '../../../app/models/product/filter/filter';

export const filterApi = createApi({
  // Define a unique name for the API slice
  reducerPath: 'filterApi',
  // Specify the base query function to use for API requests
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  // Define the types of tags that this API will use
  tagTypes: ['Filter'],
  // Define the API endpoints
  endpoints: (builder) => ({
    fetchFilters: builder.query<ResponseDto<Filter>, void>({
      query: () => `${Apis.API_TAILER.PRODUCT}/filters`,
      providesTags: ['Filter']
    }),
    editFilters: builder.mutation<ResponseDto<boolean>, FilterInput>({
      query: (filter) => ({
        url: Apis.API_TAILER.PRODUCT + '/edit-filters',
        method: Apis.API_TYPE.POST,
        body: filter
      }),
      onQueryStarted: async (filter, { dispatch, queryFulfilled }) => {
        // Optimistically update the cache with the new filter
        const patchResult = dispatch(
          filterApi.util.updateQueryData('fetchFilters', undefined, (draft) => {
            const filterCate = JSON.parse(filter.categories);
            const filterBrand = JSON.parse(filter.brands);

            draft.result = {
              categories: filterCate,
              brands: filterBrand
            };
          })
        );

        try {
          // Wait for the server response
          const { data } = await queryFulfilled;
          // If the response indicates failure, undo the optimistic update
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to edit filters');
            return;
          }
        } catch (error) {
          patchResult.undo();
          toast.error('Failed to edit filters');
          console.log(error);
        }
      },
      invalidatesTags: ['Filter']
    })
  })
});

export const { useFetchFiltersQuery, useEditFiltersMutation } = filterApi;
