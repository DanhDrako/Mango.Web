import type { ProductDto } from '../product/productDto';

export interface OrderHeaderDto {
  orderHeaderId: number;
  userId: string;
  couponCode: string | null;
  discount: number;
  orderTotal: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  deliveryFee: number;
  status: number;
  paymentIntentId: string | null;
  clientSecret: string;
  shippingAddress: ShippingAddress;
  paymentSummary: PaymentSummary;
  orderDetails: OrderDetailsDto[];
  createdAt: string;
  updatedAt: string;
}
export interface OrderDetailsDto {
  orderDetailsId: number;
  orderHeaderId: number;
  productId: number;
  product: ProductDto | null;
  quantity: number;
  productName: string;
  price: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PaymentSummary {
  last4: number | string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

// export interface OrderItem {
//   productId: number;
//   name: string;
//   imageUrl: string;
//   price: number;
//   quantity: number;
// }
