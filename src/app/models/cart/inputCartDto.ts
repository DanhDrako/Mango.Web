import type { ProductDto } from '../productDto';

export interface InputCartDto {
  userId: string;
  product: ProductDto;
  quantity: number;
}
