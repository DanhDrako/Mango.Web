import type { CartDetailsDto } from './cartDetailsDto';

export interface CartHeaderDto {
  cartHeaderId?: number;
  userId: string;
  cartDetails?: CartDetailsDto[];
  couponCode: string | null;
  discount: number;
  cartTotal: number;
  name: string | null;
  phone: string | null;
  email: string | null;
}
