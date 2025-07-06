import { counterSlice } from '../../features/contact/counterReducer';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { catalogApi } from '../../features/catalog/catalogApi';
import { uiSlice } from '../layout/uiSlice';
import { errorApi } from '../../features/about/errorApi';
import { cartApi } from '../../features/cart/cartApi';
import { catalogSlice } from '../../features/catalog/catalogSlice';
import { authApi } from '../../features/auth/authApi';
import { checkoutApi } from '../../features/checkout/checkoutApi';
import { orderApi } from '../../features/order/orderApi';
import { couponApi } from '../../features/admin/coupon/couponApi';
import { productApi } from '../../features/admin/product/productApi';
import { filterApi } from '../../features/admin/filter/filterApi';

export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [filterApi.reducerPath]: filterApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    catalog: catalogSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogApi.middleware,
      errorApi.middleware,
      cartApi.middleware,
      authApi.middleware,
      checkoutApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      couponApi.middleware,
      filterApi.middleware
    )
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
