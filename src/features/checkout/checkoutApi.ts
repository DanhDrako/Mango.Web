import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';
import type { PaymentDto } from '../../app/models/payment/paymentDto';
import type { ResponseDto } from '../../app/models/responseDto';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PAYMENT),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<ResponseDto<PaymentDto>, PaymentDto>({
      query: (paymentDto) => {
        return {
          url: Apis.API_TAILER.PAYMENT,
          method: Apis.API_TYPE.POST,
          body: paymentDto
        };
      }
      // onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       orderApi.util.updateQueryData(
      //         'fetchOrderByOrderId',
      //         data.result.orderHeaderId,
      //         (draft) => {
      //           draft.result.clientSecret = data.result.clientSecret;
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
