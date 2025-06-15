import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { CreateOrder, Order } from '../../app/models/order';
import Apis from '../../app/api/Apis';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders']
    }),
    fetchOrderDetails: builder.query<Order, number>({
      query: (id) => `orders/${id}`
    }),
    createOrder: builder.mutation<Order, CreateOrder>({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(orderApi.util.invalidateTags(['Orders'])); // Invalidate orders cache after creating a new order
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    })
  })
});

export const {
  useFetchOrdersQuery,
  useFetchOrderDetailsQuery,
  useCreateOrderMutation
} = orderApi;
