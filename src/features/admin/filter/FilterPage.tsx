import { Button, Grid, Paper, Typography } from '@mui/material';
import { useEditFiltersMutation, useFetchFiltersQuery } from './filterApi';
import FullFeaturedCrudGrid from './FullFeaturedCrudGrid';
import { useEffect, useState } from 'react';
import type {
  Brand,
  Category
} from '../../../app/models/product/filter/filter';
import { isRowsEqual } from '../../../lib/util';

export default function FilterPage() {
  const { data: response, isLoading } = useFetchFiltersQuery();
  const [editFilter] = useEditFiltersMutation();

  const [categoryRows, setCategoryRows] = useState<Category[]>([]);
  const [brandRows, setBrandRows] = useState<Brand[]>([]);

  // Store original data for comparison
  const [originalCategoryRows, setOriginalCategoryRows] = useState<Category[]>(
    []
  );
  const [originalBrandRows, setOriginalBrandRows] = useState<Brand[]>([]);

  useEffect(() => {
    if (response?.isSuccess) {
      const {
        result: { categories, brands }
      } = response;
      // replace categoryId and brandId with id
      const updatedCategories = categories.map((category) => ({
        ...category,
        id: category.categoryId
      }));

      const updatedBrands = brands.map((brand) => ({
        ...brand,
        id: brand.brandId
      }));

      // Set the state with updated categories and brands
      setCategoryRows(updatedCategories);
      setBrandRows(updatedBrands);

      // Set originals for comparison
      setOriginalCategoryRows(updatedCategories);
      setOriginalBrandRows(updatedBrands);
    }
  }, [response]);

  const isUnchanged =
    isRowsEqual(categoryRows, originalCategoryRows) &&
    isRowsEqual(brandRows, originalBrandRows);

  // ...existing code...

  if (isLoading)
    return <Typography variant="h5">Loading filters...</Typography>;

  if (!response?.isSuccess)
    return <Typography variant="h5">Fail to get filters data</Typography>;

  const titles = {
    categories: 'Categories List',
    brands: 'Brands List'
  };

  const handleSave = () => {
    try {
      // Implement save logic here
      const categoryRowsValid = categoryRows.map((category) => ({
        id: category.id,
        categoryId: category.id,
        name: category.name
      }));

      const brandRowsValid = brandRows.map((brand) => ({
        id: brand.id,
        brandId: brand.id,
        name: brand.name
      }));

      editFilter({
        categories: JSON.stringify(categoryRowsValid),
        brands: JSON.stringify(brandRowsValid)
      }).unwrap();
    } catch (error) {
      console.error('Error saving changes:', error);
      return;
    }
  };

  return (
    <>
      <Paper>
        <Typography sx={{ p: 2 }} variant="h4">
          Filters Management
        </Typography>
        <Grid container justifyContent="flex-end" sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={handleSave}
            size="medium"
            variant="contained"
            disabled={isUnchanged}
          >
            Save {isUnchanged ? '' : '*'}
          </Button>
        </Grid>
        <Grid container spacing={4}>
          <Grid size={6}>
            <FullFeaturedCrudGrid
              rows={categoryRows}
              setRows={setCategoryRows}
              title={titles.categories}
            />
          </Grid>
          <Grid size={6}>
            <FullFeaturedCrudGrid
              rows={brandRows}
              setRows={setBrandRows}
              title={titles.brands}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
