import { Grid } from '@mui/material';
import CartItem from './CartItem';
import OrderSummary from '../../app/shared/components/OrderSummary';
import { useCart } from '../../lib/hook/useCart';

export default function CartPage() {
  const { cart } = useCart();

  if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  // Destructure after guard so TS knows these are defined

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {cart.cartDetails.map((item) => (
          <CartItem userId={cart.userId} item={item} key={item.cartDetailsId} />
        ))}
      </Grid>
      <Grid size={4}>
        <OrderSummary />
      </Grid>
    </Grid>
  );
}
