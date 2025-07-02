import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TableContainer
} from '@mui/material';
import { useDeleteCouponMutation, useFetchCouponsQuery } from './couponApi';
import type { Coupon } from '../../../app/models/admin/coupon';
import { useState } from 'react';
import CouponForm from './CouponForm';
import { Delete, Edit } from '@mui/icons-material';

export default function Coupon() {
  const { data: coupons, isLoading } = useFetchCouponsQuery();
  const [editMode, setEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deleteCoupon] = useDeleteCouponMutation();

  if (isLoading)
    return <Typography variant="h5">Loading coupons...</Typography>;

  if (!coupons?.isSuccess) return <Typography variant="h5">Error</Typography>;

  const listCoupons: Coupon[] = coupons.result;

  const handleSelectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditMode(true);
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await deleteCoupon(id);
    } catch (error) {
      console.log('Error deleting coupon:', error);
    }
  };

  if (editMode) {
    return (
      <CouponForm
        setEditMode={setEditMode}
        coupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Coupons List
        </Typography>
        <Button
          onClick={() => {
            setSelectedCoupon(null);
            setEditMode(true);
          }}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create new coupon
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">CouponId</TableCell>
              <TableCell>CouponCode</TableCell>
              <TableCell>DiscountAmount</TableCell>
              <TableCell>MinAmount</TableCell>
              <TableCell align="right">Command</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listCoupons.map((coupon) => (
              <TableRow
                key={coupon.couponId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {coupon.couponId}
                </TableCell>
                <TableCell>{coupon.couponCode}</TableCell>
                <TableCell>{coupon.discountAmount}</TableCell>
                <TableCell>{coupon.minAmount}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectCoupon(coupon)}
                    startIcon={<Edit />}
                  />
                  <Button
                    onClick={() => handleDeleteCoupon(coupon.couponId)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
