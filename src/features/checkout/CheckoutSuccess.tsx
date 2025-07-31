import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import {
  currencyFormat,
  formatAddressString,
  formatPaymentString
} from '../../lib/util';
import { format } from 'date-fns';
import type { OrderHeaderDto } from '../../app/models/order/order';

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const order = state as OrderHeaderDto;

  if (!order) return <Typography variant="h5">No order found</Typography>;

  return (
    <Container>
      <>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Thank you for your fake order!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Your order <strong>#{order.orderHeaderId}</strong>will never be
          processed as this a fake shop.
        </Typography>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Order date
            </Typography>
            {order.updatedAt ? (
              <Typography variant="body2" fontWeight="bold">
                {format(order.updatedAt, 'dd MMM yyyy')}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                N/A
              </Typography>
            )}
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Payment method
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatPaymentString(order.paymentSummary)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Shipping address
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatAddressString(order.shippingAddress)}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {currencyFormat(order.orderTotal)}
            </Typography>
          </Box>
        </Paper>
        <Box display="flex" justifyContent="flex-start" gap={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/orders/${order.orderHeaderId}`}
          >
            View your order
          </Button>
          <Button
            component={Link}
            to="/catalog"
            variant="outlined"
            color="primary"
          >
            Continue shopping
          </Button>
        </Box>
      </>
    </Container>
  );
}
