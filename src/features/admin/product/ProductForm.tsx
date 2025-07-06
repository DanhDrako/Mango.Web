import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues } from 'react-hook-form';
import {
  createProductSchema,
  type CreateProductSchema
} from '../../../lib/schemas/createProductSchema';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import AppTextInput from '../../../app/shared/components/AppTextInput';
import AppSelectInput from '../../../app/shared/components/AppSelectInput';
import AppDropzone from '../../../app/shared/components/AppDropzone';
import type { ProductDto } from '../../../app/models/product/productDto';
import { useEffect } from 'react';
import {
  useCreateProductMutation,
  useUpdateProductMutation
} from './productApi';
import { LoadingButton } from '@mui/lab';
import { handleApiError } from '../../../lib/util';
import { useProduct } from '../../../lib/hook/useProduct';

type Props = {
  setEditMode: (value: boolean) => void;
  product: ProductDto | null;
  refetch: () => void;
  setSelectedProduct: (product: ProductDto | null) => void;
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
    formState: { isSubmitting, errors }
  } = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema)
  });
  console.log('Form errors:', errors);
  const watchFile = watch('file');
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { filters } = useProduct();

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        file: watchFile // preserve the dropped file if present
      });
    }

    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile]);

  if (!filters || !filters?.brands || !filters?.categories) {
    return <div>Filters not existing</div>;
  }

  const createFormData = (items: FieldValues) => {
    const formData = new FormData();
    for (const key in items) {
      formData.append(key, items[key]);
    }
    return formData;
  };

  const onSubmit = async (data: CreateProductSchema) => {
    console.log('Submitting product:', data);
    try {
      const formData = createFormData(data);

      // if (watchFile) formData.append('file', watchFile);

      // Add the file to the form data if it exists
      if (watchFile) formData.append('file', watchFile as unknown as File);

      if (product)
        await updateProduct({
          productId: product.productId,
          data: formData
        }).unwrap();
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
        'categoryId',
        'brandId',
        'quantityInStock',
        'imageUrl',
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
            {filters.categories && (
              <AppSelectInput
                items={filters.categories.map((category) => ({
                  key: category.categoryId,
                  label: category.name
                }))}
                control={control}
                name="categoryId"
                label="Category"
              />
            )}
          </Grid>{' '}
          <Grid size={6}>
            {filters.brands && (
              <AppSelectInput
                items={filters.brands.map((brand) => ({
                  key: brand.brandId,
                  label: brand.name
                }))}
                control={control}
                name="brandId"
                label="Brand"
              />
            )}
          </Grid>
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
            ) : product?.imageUrl ? (
              <img
                src={product?.imageUrl}
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
