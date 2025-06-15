import { createApi } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../app/models/product';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { ProductParams } from '../../app/models/productParams';
import { filterEmptyValues } from '../../lib/util';
import type { Pagination } from '../../app/models/pagination';
import Apis from '../../app/api/Apis';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  endpoints: (build) => ({
    fetchProducts: build.query<
      { items: Product[]; pagination: Pagination },
      ProductParams
    >({
      query: (productParams) => {
        return {
          url: 'products',
          params: filterEmptyValues(productParams)
        };
      },
      transformResponse: (items: Product[], meta) => {
        const paginationHeader = meta?.response?.headers.get('Pagination');
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { items, pagination };
      }
    }),
    fetchProductDetails: build.query<Product, number>({
      query: (id) => `products/${id}`
    }),
    fetchFilters: build.query<{ brands: string[]; types: string[] }, void>({
      query: () => 'products/filters'
    })
  })
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchFiltersQuery
} = catalogApi;
