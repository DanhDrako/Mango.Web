import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues } from 'react-hook-form';
import {
  createProductSchema,
  type CreateProductSchema
} from '../../lib/schemas/createProductSchema';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AppTextInput from '../../app/shared/components/AppTextInput';
import { useFetchFiltersQuery } from '../catalog/catalogApi';
import AppSelectInput from '../../app/shared/components/AppSelectInput';
import AppDropzone from '../../app/shared/components/AppDropzone';
import type { Product } from '../../app/models/product';
import { useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from './adminApi';
import { LoadingButton } from '@mui/lab';
import { handleApiError } from '../../lib/util';

type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (product: Product | null) => void;
};

export default function ProductForm({
  setEditMode,
  product,
  refetch,
  setSelectedProduct
}: Props) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { isSubmitting }
  } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema)
  });
  const watchFile = watch('file');
  const { data } = useFetchFiltersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) reset(product);

    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile]);

  const createFormData = (items: FieldValues) => {
    const formData = new FormData();
    for (const key in items) {
      formData.append(key, items[key]);
    }
    return formData;
  };

  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const formData = createFormData(data);

      // if (watchFile) formData.append('file', watchFile);
      if (watchFile) formData.append('file', watchFile as unknown as File);

      if (product)
        await updateProduct({ id: product.id, data: formData }).unwrap();
      else await createProduct(formData).unwrap();
      setEditMode(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.log('Error submitting product:', error);
      handleApiError<CreateProductSchema>(error, setError, [
        'name',
        'description',
        'price',
        'type',
        'brand',
        'quantityInStock',
        'pictureUrl',
        'file'
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
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid>
          <Grid size={6}>
            {data?.brands && (
              <AppSelectInput
                items={data.brands}
                control={control}
                name="brand"
                label="Brand"
              />
            )}
          </Grid>
          <Grid size={6}>
            {data?.types && (
              <AppSelectInput
                items={data.types}
                control={control}
                name="type"
                label="Type"
              />
            )}
          </Grid>{' '}
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="Price in cents"
            />
          </Grid>{' '}
          <Grid size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in stock"
            />
          </Grid>{' '}
          <Grid size={12}>
            <AppTextInput
              control={control}
              multiline
              rows={4}
              name="description"
              label="Description"
            />
          </Grid>{' '}
          <Grid
            size={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <AppDropzone control={control} name="file" />
            {watchFile?.preview ? (
              <img
                src={watchFile.preview}
                alt="preview of image"
                style={{ maxHeight: 200 }}
              />
            ) : product?.pictureUrl ? (
              <img
                src={product?.pictureUrl}
                alt="image of product"
                style={{ maxHeight: 200 }}
              />
            ) : null}
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
