import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AppTextInput from '../../../app/shared/components/AppTextInput';
import { LoadingButton } from '@mui/lab';
import { handleApiError } from '../../../lib/util';
import { useCreateCouponMutation, useUpdateCouponMutation } from './couponApi';
import {
  createCouponSchema,
  type CreateCouponSchema
} from '../../../lib/schemas/createCouponSchema';
import type { Coupon } from '../../../app/models/coupon/coupon';
import { useEffect } from 'react';

type Props = {
  setEditMode: (value: boolean) => void;
  coupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
};

export default function CouponForm({
  setEditMode,
  coupon,
  setSelectedCoupon
}: Props) {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting }
  } = useForm<CreateCouponSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createCouponSchema)
  });
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();

  useEffect(() => {
    if (coupon) reset(coupon);
  }, [coupon, reset]);

  const onSubmit = async (data: CreateCouponSchema) => {
    try {
      if (coupon) await updateCoupon({ couponId: coupon.couponId, ...data });
      else await createCoupon(data);
      setEditMode(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.log('Error submitting product:', error);
      handleApiError<CreateCouponSchema>(error, setError, [
        'couponCode',
        'discountAmount',
        'minAmount'
      ]);
    }
  };
  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput
              control={control}
              name="couponCode"
              label="Coupon code"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="discountAmount"
              label="Discount amount"
            />
          </Grid>{' '}
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="minAmount"
              label="Minimum amount"
            />
          </Grid>{' '}
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            onClick={() => setEditMode(false)}
            variant="contained"
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}
