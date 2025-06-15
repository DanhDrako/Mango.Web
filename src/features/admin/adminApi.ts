import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { Product } from '../../app/models/product';
import Apis from '../../app/api/Apis';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, FormData>({
      query: (data: FormData) => {
        return {
          url: 'products',
          method: 'POST',
          body: data
        };
      }
    }),
    updateProduct: builder.mutation<void, { id: number; data: FormData }>({
      query: ({ id, data }) => {
        data.append('id', id.toString());
        return {
          url: 'products',
          method: 'PUT',
          body: data
        };
      }
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `products/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = adminApi;
