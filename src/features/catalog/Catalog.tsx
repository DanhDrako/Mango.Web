import { Grid, Typography } from '@mui/material';
import ProductList from './ProductList';
import { useFetchFiltersQuery, useFetchProductsQuery } from './catalogApi';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import AppPagination from '../../app/shared/components/AppPagination';
import { setPageNumber } from './catalogSlice';
import type { Product } from '../../app/models/product';
import Filters from './Filters';
import type { Filter } from '../../app/models/filter';

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);
  const { data: product, isLoading } = useFetchProductsQuery(productParams);
  const { data: filter, isLoading: filtersLoading } = useFetchFiltersQuery();

  const dispatch = useAppDispatch();

  if (isLoading || !product || filtersLoading || !filter)
    return <div>Loading...</div>;

  if (!product?.response.isSuccess || !filter.isSuccess)
    return <div>Loading...</div>;

  const listProducts: Product[] = product.response.result;
  const filtersData: Filter = filter.result;

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filtersData} />
      </Grid>
      <Grid size={9}>
        {listProducts && listProducts.length > 0 ? (
          <>
            <ProductList products={listProducts} />
            <AppPagination
              metadata={product.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          <Typography variant="h5">
            There are no results for this filter
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
