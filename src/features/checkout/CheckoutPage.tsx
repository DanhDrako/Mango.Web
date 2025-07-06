import { Grid, Typography } from '@mui/material';
import OrderSummary from '../../app/shared/components/OrderSummary';
import CheckoutStepper from './CheckoutStepper';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useRef } from 'react';
import { useCreatePaymentIntentMutation } from './checkoutApi';
import { useAppSelector } from '../../app/store/store';
import { useCart } from '../../lib/hook/useCart';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { cart } = useCart();
  const { darkMode } = useAppSelector((state) => state.ui);

  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  const created = useRef(false);

  useEffect(() => {
    if (!created.current) createPaymentIntent();
    created.current = true;
  }, [createPaymentIntent]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!cart) return undefined;
    return {
      clientSecret: '',
      appearance: {
        label: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    };
  }, [cart, darkMode]);
  // const options: StripeElementsOptions | undefined = useMemo(() => {
  //   if (!cartDto?.clientSecret) return undefined;
  //   return {
  //     clientSecret: basket.clientSecret,
  //     appearance: {
  //       label: 'floating',
  //       theme: darkMode ? 'night' : 'stripe'
  //     }
  //   };
  // }, [basket?.clientSecret, darkMode]);

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {!stripePromise || !options || isLoading ? (
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
