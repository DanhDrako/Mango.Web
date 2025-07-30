import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';
import type { PaymentDto } from '../../app/models/payment/paymentDto';
import type { ResponseDto } from '../../app/models/responseDto';
import { orderApi } from '../order/orderApi';
import { OrderStatus } from '../../common/utils/keys/SD';

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
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            orderApi.util.updateQueryData(
              'fetchOrderByUserId',
              { id: data.result.userId, status: OrderStatus.Pending },
              (draft) => {
                draft.result[0].clientSecret = data.result.clientSecret;
                draft.result[0].paymentIntentId = data.result.paymentIntentId;
              }
            )
          );
        } catch (error) {
          console.log('Payment intent creation failed', error);
        }
      }
    })
  })
});

export const { useCreatePaymentIntentMutation } = checkoutApi;
