import { Grid, Typography } from '@mui/material';
import ProductList from './ProductList';
import { useFetchProductsQuery } from './catalogApi';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import AppPagination from '../../app/shared/components/AppPagination';
import { setPageNumber } from './catalogSlice';
import Filters from './Filters';
import { useProduct } from '../../lib/hook/useProduct';

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);
  const { data: product, isLoading } = useFetchProductsQuery(productParams);
	const {filters} = useProduct();

  const dispatch = useAppDispatch();

  if (isLoading || !product || !filters)
    return <div>Loading...</div>;

	const { response } = product;

  if (!response.isSuccess)
    return <div>Loading...</div>;

  const { result: listProducts } = response;

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filters} />
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
