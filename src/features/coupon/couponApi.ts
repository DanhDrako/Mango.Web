import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { Coupon } from '../../app/models/coupon';
import type { ResponseDto } from '../../app/models/responseDto';
import type { CreateCouponSchema } from '../../lib/schemas/createCouponSchema';
import { toast } from 'react-toastify';
import Apis from '../../app/api/Apis';

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.COUPON),
  tagTypes: ['Coupons'],
  endpoints: (builder) => ({
    fetchCoupons: builder.query<ResponseDto, void>({
      query: () => Apis.API_TAILER.COUPON,
      providesTags: ['Coupons']
    }),
    fetchCouponDetails: builder.query<ResponseDto, number>({
      query: (id) => `coupon/${id}`
    }),
    createCoupon: builder.mutation<ResponseDto, CreateCouponSchema>({
      query: (coupon) => ({
        url: Apis.API_TAILER.COUPON,
        method: Apis.API_TYPE.POST,
        body: coupon
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(couponApi.util.invalidateTags(['Coupons'])); // Invalidate coupons cache after creating a new coupon
          toast.success('Created coupon successfully');
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    updateCoupon: builder.mutation<ResponseDto, Coupon>({
      query: (coupon) => ({
        url: Apis.API_TAILER.COUPON,
        method: Apis.API_TYPE.PUT,
        body: coupon
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(couponApi.util.invalidateTags(['Coupons']));
          toast.success('Updated coupon successfully');
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    }),
    deleteCoupon: builder.mutation<ResponseDto, number>({
      query: (id) => ({
        url: `${Apis.API_TAILER.COUPON}/${id}`,
        method: Apis.API_TYPE.DELETE
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(couponApi.util.invalidateTags(['Coupons']));
          toast.success('Deleted coupon successfully');
        } catch (error) {
          console.log(error);
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
