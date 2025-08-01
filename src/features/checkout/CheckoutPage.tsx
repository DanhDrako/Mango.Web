import { Grid, Typography } from '@mui/material';
import OrderSummary from '../../app/shared/components/OrderSummary';
import CheckoutStepper from './CheckoutStepper';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useInfo } from '../../lib/hook/useInfo';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function buildPaymentDto(result: OrderHeaderDto) {
  return {
    userId: result.userId || '',
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

export default function CheckoutPage() {
  const { userDto } = useInfo();
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

  // Use a ref to track if the order has been updated
  const state = useRef(false);

  // Use useCallback to memoize the function
  const handleOrderUpdate = useCallback(async () => {
    // wait for order and cart to be available
    if (isLoadingOrder || !cart || !userDto) return;

    // Set cart details and current order
    const cartDetails = cart.cartDetails ?? [];
    const currentOrder =
      Array.isArray(order) && order.length > 0 ? order[0] : null;
    setResponseOrder(currentOrder);

    // Prevent multiple updates in quick succession
    if (state.current) return;
    // Set state to true to prevent further updates
    state.current = true;

    // Create new order if none exists
    if (!currentOrder) {
      try {
        const cartForOrder = {
          ...cart,
          email: userDto.email || '',
          name: userDto.name || '',
          phone: userDto.phoneNumber || '',
          cartTotal: subtotal
        };
        const response = await createOrder(cartForOrder).unwrap();
        if (!response) return;

        // Build payment DTO and create payment intent for new order
        const paymentDto = buildPaymentDto(response.result);
        createPaymentIntent(paymentDto);
      } catch (error) {
        console.error('Failed to create order:', error);
      }
      return;
    }

    // Check if order details match cart details
    if (currentOrder.orderDetails.length === cartDetails.length) {
      const isSameDetails = currentOrder.orderDetails.every((detail) => {
        const cartDetail = cartDetails.find(
          (item) => item.productId === detail.productId
        );
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
      orderTotal: subtotal
    };

    try {
      const response = await updateOrder(updatedOrder).unwrap();
      if (!response) return;
      // Build payment DTO and updating payment intent for updated order
      const paymentDto = buildPaymentDto(response.result);
      createPaymentIntent(paymentDto);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  }, [
    isLoadingOrder,
    cart,
    userDto,
    order,
    subtotal,
    createOrder,
    createPaymentIntent,
    updateOrder
  ]);

  useEffect(() => {
    // Call the handleOrderUpdate function when the component mounts or dependencies change
    handleOrderUpdate();
  }, [handleOrderUpdate]);

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
