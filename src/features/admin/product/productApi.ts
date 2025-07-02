import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../../app/api/baseApi';
import type { ProductDto } from '../../../app/models/product/productDto';
import Apis from '../../../app/api/Apis';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductDto, FormData>({
      query: (data: FormData) => {
        return {
          url: Apis.API_TAILER.PRODUCT,
          method: 'POST',
          body: data
        };
      }
    }),
    updateProduct: builder.mutation<
      void,
      { productId: number; data: FormData }
    >({
      query: ({ productId, data }) => {
        data.append('productId', productId.toString());
        return {
          url: Apis.API_TAILER.PRODUCT,
          method: 'PUT',
          body: data
        };
      }
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `${Apis.API_TAILER.PRODUCT}/${id}`,
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
} = productApi;
