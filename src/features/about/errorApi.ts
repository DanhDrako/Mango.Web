import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';

export const errorApi = createApi({
  reducerPath: 'errorApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  endpoints: (builder) => ({
    get400Error: builder.query<void, void>({
      query: () => 'buggy/bad-request'
    }),
    get401Error: builder.query<void, void>({
      query: () => 'buggy/unauthorized'
    }),
    get404Error: builder.query<void, void>({
      query: () => 'buggy/not-found'
    }),
    get500Error: builder.query<void, void>({
      query: () => 'buggy/server-error'
    }),
    getValidationError: builder.query<void, void>({
      query: () => 'buggy/validation-error'
    })
  })
});

export const {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery
} = errorApi;
