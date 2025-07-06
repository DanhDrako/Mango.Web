import { createApi } from '@reduxjs/toolkit/query/react';
import type { ProductDto } from '../../app/models/product/productDto';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { ProductParams } from '../../app/models/product/productParams';
import { filterEmptyValues } from '../../lib/util';
import type { Pagination } from '../../app/models/pagination';
import Apis from '../../app/api/Apis';
import type { ResponseDto } from '../../app/models/responseDto';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  endpoints: (build) => ({
    fetchProducts: build.query<
      { response: ResponseDto<ProductDto[]>; pagination: Pagination },
      ProductParams
    >({
      query: (productParams) => {
        return {
          url: Apis.API_TAILER.PRODUCT,
          params: filterEmptyValues(productParams)
        };
      },
      transformResponse: (response: ResponseDto<ProductDto[]>, meta) => {
        const paginationHeader = meta?.response?.headers.get('Pagination');
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { response, pagination };
      }
    }),
    fetchProductDetails: build.query<ResponseDto<ProductDto>, number>({
      query: (id) => `${Apis.API_TAILER.PRODUCT}/${id}`
    })
  })
});

export const { useFetchProductsQuery, useFetchProductDetailsQuery } =
  catalogApi;
