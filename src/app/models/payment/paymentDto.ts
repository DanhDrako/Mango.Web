export interface PaymentDto {
  userId: string;
  orderHeaderId: number;
  total: number;
  paymentIntentId: string;
  clientSecret: string;
}
