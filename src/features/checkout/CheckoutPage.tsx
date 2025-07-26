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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { cart } = useCart();
  const { result: order, isLoading } = useOrder(OrderStatus.Pending);
  const { darkMode } = useAppSelector((state) => state.ui);

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [responseOrder, setResponseOrder] = useState<OrderHeaderDto>();
  // const created = useRef(false);

  function buildPaymentDto(result: OrderHeaderDto) {
    return {
      orderHeaderId: result.orderHeaderId || 0,
      total: result.orderTotal || 0,
      paymentIntentId: result.paymentIntentId || '',
      clientSecret: result.clientSecret || ''
    };
  }

  useEffect(() => {
    // If the order is not created yet, create a new order
    // If the order is already created, update the existing order
    if (isLoading || !cart) return;

    const currentOrder = order && order.length > 0 ? order[0] : null;
    if (currentOrder && currentOrder.orderHeaderId) {
      // Update order details with cart items
      // order.orderDetails = cart.cartDetails ?? [];
      updateOrder(currentOrder)
        .unwrap()
        .then((data) => {
          setResponseOrder(data.result);
          const paymentDto = buildPaymentDto(data.result);
          return createPaymentIntent(paymentDto).unwrap();
        });
    } else {
      createOrder(cart)
        .unwrap()
        .then((data) => {
          if (!data) {
            return;
          }
          setResponseOrder(data.result);
          const paymentDto = buildPaymentDto(data.result);
          return createPaymentIntent(paymentDto).unwrap();
        });
    }

    // created.current = true;
  }, [isLoading, createOrder, createPaymentIntent, updateOrder, cart, order]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (isLoading || !responseOrder || !responseOrder.clientSecret) return;
    return {
      clientSecret: responseOrder.clientSecret,
      appearance: {
        label: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    };
  }, [isLoading, responseOrder, darkMode]);

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
