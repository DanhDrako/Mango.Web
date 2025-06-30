import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import type { ProductDto } from '../../app/models/productDto';
import { Link } from 'react-router';
import { useAddCartItemMutation } from '../cart/cartApi';
import { currencyFormat } from '../../lib/util';
import { useInfo } from '../../lib/hook/useInfo';
import type { InputCartDto } from '../../app/models/cart/inputCartDto';

type Props = {
  product: ProductDto;
};

export default function ProductCard({ product }: Props) {
  const { userDto } = useInfo();
  const [addCartItem, { isLoading }] = useAddCartItemMutation();

  const inputCartDto: InputCartDto = {
    userId: userDto?.id ?? '',
    product: product,
    quantity: 1
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: 280,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardMedia
        sx={{ height: 240, backgroundSize: 'cover' }}
        image={product.imageUrl}
        title={product.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{ textTransform: 'uppercase' }}
          variant="subtitle2"
        >
          {product.name}
        </Typography>
        <Typography sx={{ color: 'secondary.main' }} variant="h6">
          {currencyFormat(product.price)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={() => addCartItem(inputCartDto)} disabled={isLoading}>
          Add to cart
        </Button>
        <Button component={Link} to={`/catalog/${product.productId}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
