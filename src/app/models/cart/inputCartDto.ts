import type { ProductDto } from '../product/productDto';

export interface InputCartDto {
  userId: string;
  product: ProductDto;
  quantity: number;
}
