import { Button, Grid } from '@mui/material';
import CartItem from './CartItem';
import OrderSummary from '../../app/shared/components/OrderSummary';
import { useCart } from '../../lib/hook/useCart';
import { useEmailCartMutation } from './cartApi';

export default function CartPage() {
  const { cart } = useCart();
  const [emailCart] = useEmailCartMutation();

  if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
    return <h2>Your cart is empty</h2>;
  }
  const handleEmailCart = () => {
    emailCart(cart);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {cart.cartDetails.map((item) => (
          <CartItem userId={cart.userId} item={item} key={item.cartDetailsId} />
        ))}
      </Grid>
      <Grid size={4}>
        <OrderSummary />
        <Button
          onClick={handleEmailCart}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Email cart
        </Button>
      </Grid>
    </Grid>
  );
}
