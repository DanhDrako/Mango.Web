export interface PaymentDto {
  orderHeaderId: number;
  total: number;
  paymentIntentId: string;
  clientSecret: string;
}
