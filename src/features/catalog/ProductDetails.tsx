import { useParams } from 'react-router';
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useFetchProductDetailsQuery } from './catalogApi';

import { useEffect, useState, type ChangeEvent } from 'react';
import {
  useAddCartItemMutation,
  useRemoveCartItemMutation
} from '../cart/cartApi';
import { useCart } from '../../lib/hook/useCart';
import { useInfo } from '../../lib/hook/useInfo';
import type { InputCartDto } from '../../app/models/cart/inputCartDto';

export default function ProductDetails() {
  const { userDto } = useInfo();
  const { cart } = useCart();
  const { id } = useParams();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [addCartItem] = useAddCartItemMutation();
  const item = cart?.cartDetails?.find((item) => item.productId === +id!);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const { data: response, isLoading } = useFetchProductDetailsQuery(
    id ? +id : 0
  );

  if (!response?.isSuccess || isLoading) return <div>Loading...</div>;
  const { result: product } = response;
  if (!product) {
    return (
      <Typography variant="h6" color="error">
        Product not found
      </Typography>
    );
  }

  const inputCartDto: InputCartDto = {
    userId: userDto?.id ?? '',
    product: product,
    quantity: 0
  };

  const handleUpdateBasket = () => {
    const updatedQuantity = item
      ? Math.abs(quantity - item.quantity)
      : quantity;

    if (!item || quantity > item.quantity) {
      addCartItem({ ...inputCartDto, quantity: updatedQuantity });
    } else {
      removeCartItem({ ...inputCartDto, quantity: updatedQuantity });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;

    if (value >= 0) setQuantity(value);
  };

  const productDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock }
  ];

  return (
    <Grid container spacing={6} maxWidth="lg" sx={{ mx: 'auto' }}>
      <Grid size={6}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table sx={{ '& td': { fontSize: '1rem' } }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {detail.label}
                  </TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={6}>
            <Button
              onClick={handleUpdateBasket}
              disabled={
                quantity === item?.quantity || (!item && quantity === 0)
              }
              sx={{ height: '55px' }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? 'Update cart' : 'Add to cart'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
