import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';
import type { CartHeaderDto } from '../../app/models/cart/cartHeaderDto';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<CartHeaderDto, void>({
      query: () => {
        return {
          url: 'payments',
          method: 'POST'
        };
      }
      // onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       basketApi.util.updateQueryData(
      //         'fetchBasket',
      //         undefined,
      //         (draft) => {
      //           draft.clientSecret = data.clientSecret;
      //         }
      //       )
      //     );
      //   } catch (error) {
      //     console.log('Payment intent creation failed', error);
      //   }
      // }
    })
  })
});

export const { useCreatePaymentIntentMutation } = checkoutApi;
