import { Box, Button, Paper } from '@mui/material';
import Search from './Search';
import RadioButtonGroup from '../../app/shared/components/RadioButtonGroup';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import {
  resetParam,
  setBrands,
  setOrderBy,
  setCategories
} from './catalogSlice';
import CheckboxButtons from '../../app/shared/components/CheckboxButtons';
import type { Filter } from '../../app/models/product/filter/filter';

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'price', label: 'Price: Low to high' }
];

type Props = {
  filtersData: Filter;
};

export default function Filters({ filtersData: data }: Props) {
  const { brands: brandsData, categories: categoriesData } = data;
  const { orderBy, categories, brands } = useAppSelector(
    (state) => state.catalog
  );
  const dispatch = useAppDispatch();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Paper>
        <Search />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          selectedValue={orderBy}
          options={sortOptions}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={brandsData.map((brand) => brand.name)}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={categoriesData.map((category) => category.name)}
          checked={categories}
          onChange={(items: string[]) => dispatch(setCategories(items))}
        />
      </Paper>
      <Button onClick={() => dispatch(resetParam())}>Reset filters</Button>
    </Box>
  );
}
