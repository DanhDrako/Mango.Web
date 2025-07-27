import { Grid, Typography } from '@mui/material';
import OrderSummary from '../../app/shared/components/OrderSummary';
import CheckoutStepper from './CheckoutStepper';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/store/store';
import { useCart } from '../../lib/hook/useCart';
import {
  useCreateOrderMutation,
  useUpdateOrderMutation
} from '../order/orderApi';
import type { OrderHeaderDto } from '../../app/models/order/order';
import { useCreatePaymentIntentMutation } from './checkoutApi';
import { useOrder } from '../../lib/hook/useOrder';
import { OrderStatus } from '../../common/utils/keys/SD';
import type { CartDetailsDto } from '../../app/models/cart/cartDetailsDto';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function buildPaymentDto(result: OrderHeaderDto) {
  return {
    orderHeaderId: result.orderHeaderId || 0,
    total: result.orderTotal || 0,
    paymentIntentId: result.paymentIntentId || '',
    clientSecret: result.clientSecret || ''
  };
}

function mapCartDetailsToOrderDetails(
  cartDetails: CartDetailsDto[] = [],
  currentOrder: OrderHeaderDto
) {
  return cartDetails.map((item) => ({
    orderDetailsId:
      currentOrder.orderDetails.find((x) => x.productId === item.productId)
        ?.orderDetailsId || 0,
    orderHeaderId: currentOrder.orderHeaderId,
    productId: item.productId,
    product: null,
    quantity: item.quantity,
    productName: item.product?.name || '',
    price: item.product?.price || 0
  }));
}

async function updateOrderWithPaymentIntent(
  order: OrderHeaderDto,
  createPaymentIntent: ReturnType<typeof useCreatePaymentIntentMutation>[0],
  setResponseOrder: (order: OrderHeaderDto) => void
) {
  const paymentDto = buildPaymentDto(order);
  const paymentResult = await createPaymentIntent(paymentDto).unwrap();
  const { result: paymentResultData } = paymentResult;

  if (!paymentResultData) return;

  const updatedResult = {
    ...order,
    clientSecret: paymentResultData.clientSecret,
    paymentIntentId: paymentResultData.paymentIntentId
  };

  setResponseOrder(updatedResult);
}

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();
  const { result: order, isLoading: isLoadingOrder } = useOrder(
    OrderStatus.Pending
  );
  const { darkMode } = useAppSelector((state) => state.ui);

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [responseOrder, setResponseOrder] = useState<OrderHeaderDto | null>(
    null
  );

  useEffect(() => {
    if (isLoadingOrder || !cart) return;

    const cartDetails = cart.cartDetails ?? [];
    const currentOrder =
      Array.isArray(order) && order.length > 0 ? order[0] : null;
    setResponseOrder(currentOrder);

    // Create new order if none exists
    if (!currentOrder) {
      const cartForOrder = { ...cart, cartTotal: subtotal };
      createOrder(cartForOrder)
        .unwrap()
        .then(async (data) => {
          if (!data) return;
          const { result } = data;
          await updateOrderWithPaymentIntent(
            result,
            createPaymentIntent,
            setResponseOrder
          );
        });
      return;
    }

    // Check if order details match cart details
    if (currentOrder.orderDetails.length === cartDetails.length) {
      const isSameDetails = currentOrder.orderDetails.every((detail, index) => {
        const cartDetail = cartDetails[index];
        return (
          cartDetail &&
          detail.productId === cartDetail.productId &&
          detail.quantity === cartDetail.quantity
        );
      });
      if (isSameDetails) return;
    }

    // Map and update order if details differ
    const updatedOrder: OrderHeaderDto = {
      ...currentOrder,
      orderDetails: mapCartDetailsToOrderDetails(cartDetails, currentOrder),
      orderTotal: subtotal,
      clientSecret: currentOrder.clientSecret || '',
      paymentIntentId: currentOrder.paymentIntentId || ''
    };

    updateOrder(updatedOrder)
      .unwrap()
      .then(async (data) => {
        const { result } = data;
        await updateOrderWithPaymentIntent(
          result,
          createPaymentIntent,
          setResponseOrder
        );
      });
  }, [
    isLoadingOrder,
    createOrder,
    createPaymentIntent,
    updateOrder,
    cart,
    subtotal,
    order
  ]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (isLoadingOrder || !responseOrder || !responseOrder.clientSecret) return;
    return {
      clientSecret: responseOrder.clientSecret,
      appearance: {
        label: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    };
  }, [isLoadingOrder, responseOrder, darkMode]);

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {!stripePromise || !options ? (
          <Typography variant="h6">Loading checkout...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid>
      <Grid size={4}>
        <OrderSummary />
      </Grid>
    </Grid>
  );
}
