import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { Address, User } from '../../app/models/user';
import type { LoginSchema } from '../../lib/schemas/loginSchema';
import { router } from '../../app/routes/Routes';
import { toast } from 'react-toastify';
import Apis from '../../app/api/Apis';

export const accountApi = createApi({
  // Define a unique name for the API slice
  reducerPath: 'accountApi',
  // Specify the base query function to use for API requests
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.MAIN),
  // Define the types of tags that this API will use
  tagTypes: ['UserInfo'],
  // Define the API endpoints
  endpoints: (builder) => ({
    // Define a mutation for logging in
    login: builder.mutation<void, LoginSchema>({
      // Specify the query function for the login mutation
      query: (creds) => {
        return {
          url: 'login?useCookies=true',
          method: 'POST',
          body: creds
        };
      },
      // Specify the tags to invalidate when this mutation is successful
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // Wait for the login mutation to complete
          await queryFulfilled;
          // Invalidate the user info cache to refresh it after login
          dispatch(accountApi.util.invalidateTags(['UserInfo']));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    register: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: 'account/register',
          method: 'POST',
          body: creds
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Registration successful - you can now sign in!');
          router.navigate('/login');
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    userInfo: builder.query<User, void>({
      query: () => 'account/user-info',
      // Specify the tags to cache this query
      // This will allow us to invalidate this query when the user logs in or out
      providesTags: ['UserInfo']
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'account/logout',
        method: 'POST'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(accountApi.util.invalidateTags(['UserInfo']));
        router.navigate('/');
      }
    }),
    fetchAddress: builder.query<Address, void>({
      query: () => 'account/address'
    }),
    updateAddress: builder.mutation<Address, Address>({
      query: (address) => ({
        url: 'account/address',
        method: 'POST',
        body: address
      }),
      onQueryStarted: async (address, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          accountApi.util.updateQueryData(
            'fetchAddress',
            undefined,
            (draft) => {
              Object.assign(draft, { ...address });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log('Update address failed', error);
        }
      }
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserInfoQuery,
  useLazyUserInfoQuery,
  useLogoutMutation,
  useFetchAddressQuery,
  useUpdateAddressMutation
} = accountApi;
