import type { CartDetailsDto } from '../../app/models/cart/cartDetailsDto';
import { useFetchCartQuery } from '../../features/cart/cartApi';
import { useInfo } from './useInfo';

export const useCart = () => {
  const { userDto } = useInfo();

  const { data: responseCart } = useFetchCartQuery(userDto?.id ?? '', {
    skip: !userDto?.id // skip if userId is not available yet
  });

  if (!responseCart?.isSuccess || !responseCart?.result)
    return {
      cart: null,
      userDto: userDto,
      subtotal: 0,
      deliveryFee: 0,
      total: 0
    };

  const { result: cart } = responseCart;

  const subtotal =
    cart.cartDetails.reduce(
      (total: number, item: CartDetailsDto) =>
        item.product ? total + item.product.price * item.quantity : total,
      0
    ) ?? 0;

  const deliveryFee = subtotal > 10000 ? 0 : 500;

  const total = subtotal + deliveryFee;

  return {
    cart,
    userDto,
    subtotal,
    deliveryFee,
    total
  };
};
