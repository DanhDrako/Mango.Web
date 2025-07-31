import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useFetchOrdersQuery } from './orderApi';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { currencyFormat } from '../../lib/util';
import { OrderStatusText } from '../../common/utils/keys/SD';

export default function OrdersPage() {
  const { data, isLoading } = useFetchOrdersQuery();
  const navigate = useNavigate();

  if (isLoading) return <Typography variant="h5">Loading orders...</Typography>;

  if (!data) return <Typography variant="h5">No orders available</Typography>;

  const { result: orders } = data;

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        My orders
      </Typography>
      <Paper sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Order</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.orderHeaderId}
                hover
                onClick={() => navigate(`/orders/${order.orderHeaderId}`)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell align="center">#{order.orderHeaderId}</TableCell>
                <TableCell>{format(order.updatedAt, 'dd MMM yyyy')}</TableCell>
                <TableCell>{currencyFormat(order.orderTotal)}</TableCell>
                <TableCell>{OrderStatusText[order.status]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
