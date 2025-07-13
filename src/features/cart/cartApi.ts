import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import Apis from '../../app/api/Apis';
import type { ResponseDto } from '../../app/models/responseDto';
import type { InputCartDto } from '../../app/models/cart/inputCartDto';
import type { CartHeaderDto } from '../../app/models/cart/cartHeaderDto';

// function isCartItem(
//   product: ProductDto | CartDetailsDto
// ): product is CartDetailsDto {
//   return (product as CartDetailsDto).quantity !== undefined;
// }
export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithErrorHandling(Apis.URL_BASE.CART),
  tagTypes: ['Cart'],
  endpoints: (build) => ({
    fetchCart: build.query<ResponseDto<CartHeaderDto>, string>({
      query: (userId) => `${Apis.API_TAILER.CART}/${userId}`,
      providesTags: ['Cart']
    }),
    addCartItem: build.mutation<ResponseDto<CartHeaderDto>, InputCartDto>({
      query: (inputCartDto) => {
        // const productId = isBasketItem(product)
        //   ? product.productId
        //   : product.productId;
        return {
          url: Apis.API_TAILER.CART + '/CartUpsert',
          method: Apis.API_TYPE.POST,
          body: {
            ...inputCartDto,
            productId: inputCartDto.product.productId
          }
        };
      },
      onQueryStarted: async (inputCartDto, { dispatch, queryFulfilled }) => {
        let isNewCart = false;
        const patchResult = dispatch(
          cartApi.util.updateQueryData(
            'fetchCart',
            inputCartDto.userId,
            (draft) => {
              const newProduct = inputCartDto.product;
              if (!newProduct) {
                return;
              }

              if (!draft.result?.cartHeaderId) isNewCart = true;

              if (!isNewCart) {
                const existingItem = draft.result.cartDetails?.find(
                  (item) => item.productId === newProduct.productId
                );

                if (existingItem)
                  existingItem.quantity += inputCartDto.quantity;
                else
                  draft.result.cartDetails?.push({
                    cartHeaderId: draft.result.cartHeaderId,
                    product: newProduct,
                    productId: newProduct.productId,
                    quantity: inputCartDto.quantity
                  });
              }
            }
          )
        );

        try {
          await queryFulfilled;

          if (isNewCart) dispatch(cartApi.util.invalidateTags(['Cart']));
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
    removeCartItem: build.mutation<boolean, InputCartDto>({
      query: (inputCartDto) => ({
        url: `${Apis.API_TAILER.CART}/RemoveCart`,
        method: Apis.API_TYPE.DELETE,
        body: {
          ...inputCartDto,
          productId: inputCartDto.product.productId
        }
      }),
      onQueryStarted: async (inputCartDto, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          cartApi.util.updateQueryData(
            'fetchCart',
            inputCartDto.userId,
            (draft) => {
              const { cartDetails } = draft.result;
              if (!cartDetails) {
                return;
              }

              const itemIndex = cartDetails.findIndex(
                (item) => item.productId === inputCartDto.product.productId
              );

              if (itemIndex >= 0) {
                cartDetails[itemIndex].quantity -= inputCartDto.quantity;
                if (cartDetails[itemIndex].quantity <= 0) {
                  cartDetails.splice(itemIndex, 1);
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
    clearCart: build.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      onQueryStarted: async (_, { dispatch }) => {
        // You must provide a userId string as the second argument instead of undefined.
        // For example, if you have access to the userId in this scope, use it here:
        // Replace 'userId' with the actual user id variable you have available.
        const userId = ''; // TODO: Replace with actual user id
        dispatch(
          cartApi.util.updateQueryData('fetchCart', userId, (draft) => {
            // draft.items = [];
            draft.result.cartDetails = [];
          })
        );
        //Cookies.remove('basketId');
      }
    }),
    emailCart: build.mutation<ResponseDto<boolean>, CartHeaderDto>({
      query: (inputCartDto) => {
        return {
          url: Apis.API_TAILER.CART + '/EmailCartRequest',
          method: Apis.API_TYPE.POST,
          body: inputCartDto
        };
      }
    })
  })
});
export const {
  useFetchCartQuery,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useEmailCartMutation
} = cartApi;
