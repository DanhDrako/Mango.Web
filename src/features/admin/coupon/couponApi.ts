import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../../app/api/baseApi';
import type { Coupon } from '../../../app/models/admin/coupon';
import type { ResponseDto } from '../../../app/models/responseDto';
import type { CreateCouponSchema } from '../../../lib/schemas/createCouponSchema';
import { toast } from 'react-toastify';
import Apis from '../../../app/api/Apis';

export const couponApi = createApi({
  // Define a unique name for the API slice
  reducerPath: 'couponApi',
  // Specify the base query function to use for API requests
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.COUPON),
  // Define the types of tags that this API will use
  tagTypes: ['Coupons'],
  // Define the API endpoints
  endpoints: (builder) => ({
    fetchCoupons: builder.query<ResponseDto<Coupon[]>, void>({
      query: () => Apis.API_TAILER.COUPON,
      providesTags: ['Coupons']
    }),
    fetchCouponDetails: builder.query<ResponseDto<Coupon>, number>({
      query: (id) => Apis.API_TAILER.COUPON + `/${id}`
    }),
    createCoupon: builder.mutation<ResponseDto<Coupon>, CreateCouponSchema>({
      query: (coupon) => ({
        url: Apis.API_TAILER.COUPON,
        method: Apis.API_TYPE.POST,
        body: coupon
      }),
      onQueryStarted: async (coupon, { dispatch, queryFulfilled }) => {
        // Approach 1: Invalidate the coupons cache to refetch after creating a new coupon
        //dispatch(couponApi.util.invalidateTags(['Coupons']));

        // Approach 2:
        // Optimistically update the cache with a temporary coupon
        // This allows the UI to update immediately while waiting for the server response
        const patchResult = dispatch(
          couponApi.util.updateQueryData('fetchCoupons', undefined, (draft) => {
            // Optimistically update the cache with a new coupon
            draft.result.push({
              couponId: 0, // Temporary ID, will be replaced by the server
              couponCode: coupon.couponCode,
              discountAmount: coupon.discountAmount,
              minAmount: coupon.minAmount
            });
          })
        );

        try {
          // Wait for the server response
          const { data } = await queryFulfilled;
          // If the response indicates failure, undo the optimistic update
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to create coupon');
            return;
          }

          // Replace the temporary ID with the actual ID returned from the server
          const newCoupon = data.result;
          // Update the cache again to replace the temporary coupon with the real one
          dispatch(
            couponApi.util.updateQueryData(
              'fetchCoupons',
              undefined,
              (draft) => {
                const index = draft.result.findIndex((c) => c.couponId === 0);
                if (index !== -1) {
                  draft.result[index] = newCoupon;
                }
              }
            )
          );
          // Successfully created the coupon, show success message
          toast.success('Created coupon successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo();
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    updateCoupon: builder.mutation<ResponseDto<Coupon>, Coupon>({
      query: (coupon) => ({
        url: Apis.API_TAILER.COUPON,
        method: Apis.API_TYPE.PUT,
        body: coupon
      }),
      onQueryStarted: async (coupon, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          couponApi.util.updateQueryData('fetchCoupons', undefined, (draft) => {
            // Optimistically update the cache with the updated coupon
            const index = draft.result.findIndex(
              (c) => c.couponId === coupon.couponId
            );
            if (index !== -1) {
              draft.result[index] = {
                ...draft.result[index],
                ...coupon
              };
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to update coupon');
            return;
          }
          toast.success('Updated coupon successfully');
        } catch (error) {
          console.log(error);
          patchResult.undo(); // Undo the optimistic update if the request fails
          throw error;
        }
      }
    }),
    deleteCoupon: builder.mutation<ResponseDto<Coupon>, number>({
      query: (id) => ({
        url: `${Apis.API_TAILER.COUPON}/${id}`,
        method: Apis.API_TYPE.DELETE
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          couponApi.util.updateQueryData('fetchCoupons', undefined, (draft) => {
            // Optimistically remove the coupon from the cache
            draft.result = draft.result.filter((c) => c.couponId !== id);
          })
        );
        try {
          const { data } = await queryFulfilled;
          if (!data || !data.isSuccess) {
            patchResult.undo();
            toast.error(data?.message || 'Failed to delete coupon');
            return;
          }
          toast.success('Deleted coupon successfully');
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
  useFetchCouponsQuery,
  useFetchCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation
} = couponApi;
