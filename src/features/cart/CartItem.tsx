import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Add, Close, Remove } from '@mui/icons-material';
import { currencyFormat } from '../../lib/util';
import { useAddCartItemMutation, useRemoveCartItemMutation } from './cartApi';
import type { CartDetailsDto } from '../../app/models/cart/cartDetailsDto';
import type { InputCartDto } from '../../app/models/cart/inputCartDto';

type Props = {
  userId: string;
  item: CartDetailsDto;
};

export default function CartItem({ userId, item }: Props) {
  const [addCartItem] = useAddCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  if (!item.product) {
    return (
      <Paper
        sx={{
          height: 140,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h6">Product not found</Typography>
      </Paper>
    );
  }

  const inputCartDto: InputCartDto = {
    userId,
    product: item.product,
    quantity: 1
  };

  return (
    <Paper
      sx={{
        height: 140,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src={item.product.imageUrl}
          alt={item.product.name}
          sx={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            borderRadius: '4px',
            mr: 8,
            ml: 4
          }}
        />
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6">{item.product.name}</Typography>

          <Box display="flex" alignItems="center" gap={3}>
            <Typography sx={{ fontSize: '1.1rem' }}>
              {currencyFormat(item.product.price)} x {item.quantity}
            </Typography>
            <Typography sx={{ fontSize: '1.1rem' }} color="primary">
              {currencyFormat(item.product.price * item.quantity)}
            </Typography>
          </Box>

          <Grid container spacing={1} alignItems="center">
            <IconButton
              onClick={() => removeCartItem(inputCartDto)}
              color="error"
              size="small"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
            >
              <Remove />
            </IconButton>
            <Typography variant="h6">{item.quantity}</Typography>
            <IconButton
              onClick={() => addCartItem(inputCartDto)}
              color="success"
              size="small"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
            >
              <Add />
            </IconButton>
          </Grid>
        </Box>
      </Box>

      <IconButton
        onClick={() =>
          removeCartItem({
            ...inputCartDto,
            quantity: item.quantity
          })
        }
        color="error"
        size="small"
        sx={{
          border: 1,
          borderRadius: 1,
          minWidth: 0,
          alignSelf: 'start',
          mr: 1,
          mt: 1
        }}
      >
        <Close />
      </IconButton>
    </Paper>
  );
}
