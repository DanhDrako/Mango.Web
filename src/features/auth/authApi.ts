import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { Address, UserDto } from '../../app/models/auth/userDto';
import type { LoginSchema } from '../../lib/schemas/loginSchema';
import { router } from '../../app/routes/Routes';
import { toast } from 'react-toastify';
import Apis from '../../app/api/Apis';
import type { ResponseDto } from '../../app/models/responseDto';
import type { LoginResponseDto } from '../../app/models/auth/loginResponseDto';
import type { RegisterSchema } from '../../lib/schemas/registerSchema';
import TokenProvider from '../../app/service/TokenProvider';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.AUTH),
  tagTypes: ['UserInfo'],
  endpoints: (builder) => ({
    login: builder.mutation<ResponseDto<LoginResponseDto>, LoginSchema>({
      query: (creds) => {
        return {
          url: Apis.API_TAILER.AUTH + '/login',
          method: Apis.API_TYPE.POST,
          body: creds
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(['UserInfo']));
        } catch (error) {
          console.log(error);
          throw error; // Re-throw the error to be handled by the base query error handling
        }
      }
    }),
    register: builder.mutation<ResponseDto<object>, RegisterSchema>({
      query: (creds) => {
        return {
          url: Apis.API_TAILER.AUTH + '/register',
          method: Apis.API_TYPE.POST,
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
    assignRole: builder.mutation<ResponseDto<object>, RegisterSchema>({
      query: (creds) => ({
        url: Apis.API_TAILER.AUTH + '/AssignRole',
        method: Apis.API_TYPE.POST,
        body: creds
      })
    }),
    userInfo: builder.query<ResponseDto<UserDto>, void>({
      query: () => Apis.API_TAILER.AUTH + '/user-info',
      // Specify the tags to cache this query
      // This will allow us to invalidate this query when the user logs in or out
      providesTags: ['UserInfo']
    }),
    logout: builder.mutation({
      query: () => ({
        url: Apis.API_TAILER.AUTH + '/logout',
        method: Apis.API_TYPE.POST
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        TokenProvider.clearToken();
        dispatch(authApi.util.invalidateTags(['UserInfo']));
        router.navigate('/');
      }
    }),
    fetchAddress: builder.query<Address, void>({
      query: () => Apis.API_TAILER.AUTH + '/address'
    }),
    updateAddress: builder.mutation<Address, Address>({
      query: (address) => ({
        url: Apis.API_TAILER.AUTH + '/address',
        method: Apis.API_TYPE.POST,
        body: address
      }),
      onQueryStarted: async (address, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          authApi.util.updateQueryData('fetchAddress', undefined, (draft) => {
            Object.assign(draft, { ...address });
          })
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
  useUpdateAddressMutation,
  useAssignRoleMutation
} = authApi;
