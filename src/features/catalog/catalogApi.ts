import { createApi } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../app/models/product';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { ProductParams } from '../../app/models/productParams';
import { filterEmptyValues } from '../../lib/util';
import type { Pagination } from '../../app/models/pagination';
import Apis from '../../app/api/Apis';
import type { ResponseDto } from '../../app/models/responseDto';
import type { Filter } from '../../app/models/filter';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.PRODUCT),
  endpoints: (build) => ({
    fetchProducts: build.query<
      { response: ResponseDto<Product[]>; pagination: Pagination },
      ProductParams
    >({
      query: (productParams) => {
        return {
          url: Apis.API_TAILER.PRODUCT,
          params: filterEmptyValues(productParams)
        };
      },
      transformResponse: (response: ResponseDto<Product[]>, meta) => {
        const paginationHeader = meta?.response?.headers.get('Pagination');
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { response, pagination };
      }
    }),
    fetchProductDetails: build.query<ResponseDto<Product>, number>({
      query: (id) => `${Apis.API_TAILER.PRODUCT}/${id}`
    }),
    fetchFilters: build.query<ResponseDto<Filter>, void>({
      query: () => `${Apis.API_TAILER.PRODUCT}/filters`
    })
  })
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchFiltersQuery
} = catalogApi;
