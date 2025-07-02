import { Grid } from '@mui/material';
import type { ProductDto } from '../../app/models/product/productDto';
import ProductCard from './ProductCard';

type Props = {
  products: ProductDto[];
};

export default function ProductList({ products }: Props) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={3} display="flex" key={product.productId}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
