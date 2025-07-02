import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AppTextInput from '../../../app/shared/components/AppTextInput';
import { LoadingButton } from '@mui/lab';
import { handleApiError } from '../../../lib/util';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from './categoryApi';
import { useEffect } from 'react';
import type { CategoryDto } from '../../../app/models/admin/categoryDto';
import {
  createCategorySchema,
  type CreateCategorySchema
} from '../../../lib/schemas/createCategorySchema';

type Props = {
  setEditMode: (value: boolean) => void;
  category: CategoryDto | null;
  setSelectedCategory: (category: CategoryDto | null) => void;
};

export default function CategoryForm({
  setEditMode,
  category,
  setSelectedCategory
}: Props) {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting }
  } = useForm<CreateCategorySchema>({
    mode: 'onTouched',
    resolver: zodResolver(createCategorySchema)
  });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) reset(category);
  }, [category, reset]);

  const onSubmit = async (data: CreateCategorySchema) => {
    try {
      if (category)
        await updateCategory({ categoryId: category.categoryId, ...data });
      else await createCategory(data);
      setEditMode(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log('Error submitting product:', error);
      handleApiError<CreateCategorySchema>(error, setError, ['name']);
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
