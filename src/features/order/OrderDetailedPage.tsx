import { Link, useParams } from 'react-router';
import { useFetchOrderByOrderIdQuery } from './orderApi';
import {
  Box,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import {
  currencyFormat,
  formatAddressString,
  formatPaymentString
} from '../../lib/util';
import { OrderStatusText } from '../../common/utils/keys/SD';

export default function OrderDetailedPage() {
  const { id } = useParams();

  const { data, isLoading } = useFetchOrderByOrderIdQuery(+id!);

  if (!data) return <Typography variant="h5">Order not found</Typography>;
  if (isLoading)
    return <Typography variant="h5">Loading order details...</Typography>;

  const { result: order } = data;

  if (isLoading)
    return <Typography variant="h5">Loading order details...</Typography>;
  if (!order) return <Typography variant="h5">Order not found</Typography>;

  return (
    <Card sx={{ p: 2, maxWidth: 'md', mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" align="center">
          Order summary for #{order.orderHeaderId}
        </Typography>
        <Button component={Link} to="/orders" variant="outlined">
          Back to orders
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" fontWeight="bold">
          Billing and deliver information
        </Typography>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Shipping address
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {formatAddressString(order.shippingAddress)}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Payment info
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {formatPaymentString(order.paymentSummary)}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" fontWeight="bold">
          Order details
        </Typography>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Email address
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {order.email}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order status
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {OrderStatusText[order.status]}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order date
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {format(order.updatedAt, 'dd MMM yyyy')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <TableContainer>
        <Table>
          <TableBody>
            {order?.orderDetails.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ borderBottom: '1px solid rgba(244, 244, 244, 1)' }}
              >
                <TableCell sx={{ py: 4 }}>
                  <Box display="flex" gap={3} alignItems="center">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      style={{ width: 40, height: 40 }}
                    />
                    <Typography>{item.product?.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ p: 4 }}>
                  x {item?.quantity}
                </TableCell>
                <TableCell align="right" sx={{ p: 4 }}>
                  {currencyFormat(item.price * item?.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mx={3}>
        <Box component="dl" display="flex" justifyContent="space-between">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Subtotal
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {currencyFormat(order.orderTotal)}
          </Typography>
        </Box>
        <Box component="dl" display="flex" justifyContent="space-between">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Discount
          </Typography>
          <Typography
            component="dd"
            variant="body2"
            fontWeight="300"
            color="green"
          >
            {currencyFormat(order.discount)}
          </Typography>
        </Box>
        <Box component="dl" display="flex" justifyContent="space-between">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Delivery fee
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="300">
            {currencyFormat(order.deliveryFee)}
          </Typography>
        </Box>
      </Box>
      <Box component="dl" display="flex" justifyContent="space-between" mx={3}>
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Total
        </Typography>
        <Typography component="dd" variant="body2" fontWeight="700">
          {currencyFormat(
            order.orderTotal + order.deliveryFee - order.discount
          )}
        </Typography>
      </Box>
    </Card>
  );
}
