import {
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs
} from '@reduxjs/toolkit/query';
import { startLoading, stopLoading } from '../layout/uiSlice';
import { toast } from 'react-toastify';
import { router } from '../routes/Routes';
import type { ResponseDto } from '../models/responseDto';
import TokenProvider from '../service/TokenProvider';

export const createCustomBaseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = TokenProvider.getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling =
  (baseUrl: string) =>
  async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const customBaseQuery = createCustomBaseQuery(baseUrl);
    api.dispatch(startLoading());
    if (import.meta.env.DEV) await sleep();
    const result = await customBaseQuery(args, api, extraOptions);
    api.dispatch(stopLoading());
    if (result.error) {
      const originalStatus =
        result.error.status === 'PARSING_ERROR' && result.error.originalStatus
          ? result.error.originalStatus
          : result.error.status;
      const responseData = result.error.data as ResponseDto<object>;
      const errorMessage = responseData?.message;
      switch (originalStatus) {
        case 400:
          if (
            typeof errorMessage === 'string' &&
            !errorMessage.includes('is already taken.')
          )
            toast.error(errorMessage);
          break;
        case 401:
          toast.error('401 Unauthorized');
          router.navigate('/login');

          break;
        case 403:
          toast.error('403 Forbidden');
          break;
        case 404:
          if (typeof errorMessage === 'string') {
            toast.error(errorMessage);
          } else {
            //toast.error('404 Not Found');
            router.navigate('/not-found');
          }
          break;
        case 500:
          if (typeof errorMessage === 'string') {
            router.navigate('/server-error', {
              state: { error: errorMessage }
            });
          } else {
            //toast.error('500 Internal Server Error');
          }
          break;
        default:
          break;
      }
    }

    return result;
  };
