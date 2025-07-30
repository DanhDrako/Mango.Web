import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';
import type { CartHeaderDto } from '../../app/models/cart/cartHeaderDto';
import type { ResponseDto } from '../../app/models/responseDto';
import type { OrderHeaderDto } from '../../app/models/order/order';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.ORDER),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    fetchOrders: builder.query<ResponseDto<OrderHeaderDto[]>, void>({
      query: () => Apis.API_TAILER.ORDER,
      providesTags: ['Orders']
    }),
    fetchOrderByOrderId: builder.query<ResponseDto<OrderHeaderDto>, number>({
      query: (id) => `${Apis.API_TAILER.ORDER}/${id}`
    }),
    fetchOrderByUserId: builder.query<
      ResponseDto<OrderHeaderDto[]>,
      { id: string; status?: number }
    >({
      query: ({ id, status }) => `order?status=${status}&userId=${id}`
    }),
    createOrder: builder.mutation<ResponseDto<OrderHeaderDto>, CartHeaderDto>({
      query: (order) => ({
        url: Apis.API_TAILER.ORDER,
        method: Apis.API_TYPE.POST,
        body: order
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            orderApi.util.updateQueryData(
              'fetchOrderByUserId',
              { id: data.result.userId, status: data.result.status },
              (draft) => {
                draft.result.push(data.result);
              }
            )
          );
        } catch (error) {
          console.log('Order creation failed', error);
        }
      },
      invalidatesTags: ['Orders']
    }),
    updateOrder: builder.mutation<ResponseDto<OrderHeaderDto>, OrderHeaderDto>({
      query: (order) => ({
        url: Apis.API_TAILER.ORDER,
        method: Apis.API_TYPE.PUT,
        body: order
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            orderApi.util.updateQueryData(
              'fetchOrderByUserId',
              { id: data.result.userId, status: data.result.status },
              (draft) => {
                const index = draft.result.findIndex(
                  (o) => o.orderHeaderId === data.result.orderHeaderId
                );
                if (index !== -1) {
                  draft.result[index] = data.result;
                }
              }
            )
          );
        } catch (error) {
          console.log('Order update failed', error);
        }
      },
      invalidatesTags: ['Orders']
    })
  })
});

export const {
  useFetchOrdersQuery,
  useFetchOrderByOrderIdQuery,
  useFetchOrderByUserIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation
} = orderApi;
