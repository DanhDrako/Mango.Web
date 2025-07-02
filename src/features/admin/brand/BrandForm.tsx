import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AppTextInput from '../../../app/shared/components/AppTextInput';
import { LoadingButton } from '@mui/lab';
import { handleApiError } from '../../../lib/util';
import { useCreateBrandMutation, useUpdateBrandMutation } from './brandApi';
import { useEffect } from 'react';
import type { BrandDto } from '../../../app/models/admin/brandDto';
import {
  createBrandSchema,
  type CreateBrandSchema
} from '../../../lib/schemas/createBrandSchema';

type Props = {
  setEditMode: (value: boolean) => void;
  brand: BrandDto | null;
  setSelectedBrand: (brand: BrandDto | null) => void;
};

export default function BrandForm({
  setEditMode,
  brand,
  setSelectedBrand
}: Props) {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting }
  } = useForm<CreateBrandSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createBrandSchema)
  });
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  useEffect(() => {
    if (brand) reset(brand);
  }, [brand, reset]);

  const onSubmit = async (data: CreateBrandSchema) => {
    try {
      if (brand) await updateBrand({ brandId: brand.brandId, ...data });
      else await createBrand(data);
      setEditMode(false);
      setSelectedBrand(null);
    } catch (error) {
      console.log('Error submitting brand:', error);
      handleApiError<CreateBrandSchema>(error, setError, ['name']);
    }
  };
  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Brand details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control} name="name" label="Name" />
          </Grid>
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
