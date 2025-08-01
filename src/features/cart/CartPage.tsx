import { Button, Grid } from '@mui/material';
import CartItem from './CartItem';
import OrderSummary from '../../app/shared/components/OrderSummary';
import { useCart } from '../../lib/hook/useCart';
import { useEmailCartMutation } from './cartApi';

export default function CartPage() {
  const { userDto, cart } = useCart();
  const [emailCart] = useEmailCartMutation();

  if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
    return <h2>Your cart is empty</h2>;
  }
  const handleEmailCart = () => {
    if (!userDto) {
      console.error('User information is not available');
      return;
    }
    if (!cart) {
      console.error('Cart is not available');
      return;
    }

    emailCart({
      ...cart,
      userId: userDto.id,
      email: userDto.email,
      name: userDto.name,
      phone: userDto.phoneNumber
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {cart.cartDetails.map((item, index) => (
          <CartItem userId={cart.userId} item={item} key={index} />
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
