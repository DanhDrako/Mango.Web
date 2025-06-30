import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { currencyFormat } from '../../lib/util';
import type { ConfirmationToken } from '@stripe/stripe-js';
import { useCart } from '../../lib/hook/useCart';

type Props = {
  confirmationToken: ConfirmationToken | null;
};

export default function Review({ confirmationToken }: Props) {
  const { cart } = useCart();

  if (!cart || !cart.cartDetails) {
    return (
      <Typography variant="h6" color="error">
        No products in the cart.
      </Typography>
    );
  }

  const addressString = () => {
    if (!confirmationToken?.shipping) return '';
    const { name, address } = confirmationToken.shipping;
    return `${name}, ${address?.line1}, ${address?.city}, ${address?.state},
			${address?.postal_code}, ${address?.country}`;
  };

  const paymentString = () => {
    if (!confirmationToken?.payment_method_preview.card) return '';
    const { card } = confirmationToken.payment_method_preview;
    return `${card.brand.toUpperCase()}, **** **** **** ${card.last4}, 
		Exp: ${card.exp_month}/${card.exp_year}`;
  };
  return (
    <>
      <Box mt={4} width="100%">
        <Typography variant="h6" fontWeight="bold">
          Billing and delivery information
        </Typography>
        <dl>
          <Typography component="dt" fontWeight="medium">
            Shipping address
          </Typography>
          <Typography component="dd" mt={1} color="textSecondary">
            {addressString()}
          </Typography>

          <Typography component="dt" fontWeight="medium">
            Payment details
          </Typography>
          <Typography component="dd" mt={1} color="textSecondary">
            {paymentString()}
          </Typography>
        </dl>
      </Box>

      <Box mt={6} mx="auto">
        <Divider />
        <TableContainer>
          <Table>
            <TableBody>
              {cart.cartDetails.map((item) =>
                item.product ? (
                  <TableRow
                    key={item.productId}
                    sx={{ borderBottom: '1px solid rgba(244, 244, 244, 1)' }}
                  >
                    <TableCell sx={{ py: 4 }}>
                      <Box display="flex" gap={3} alignItems="center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{ width: 40, height: 40 }}
                        />
                        <Typography>{item.product.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ p: 4 }}>
                      x {item.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ p: 4 }}>
                      {currencyFormat(item.product.price)}
                    </TableCell>
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
