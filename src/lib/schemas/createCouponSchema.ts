import { z } from 'zod';

export const createCouponSchema = z.object({
  couponCode: z.string({ required_error: 'Coupon code is required' }),
  discountAmount: z.coerce
    .number({ required_error: 'Discount amount is required' })
    .min(1, 'Discount amount must be at least 1'),
  minAmount: z.coerce
    .number({ required_error: 'Min amount is required' })
    .min(1, 'Min amount must be at least 1')
});

export type CreateCouponSchema = z.infer<typeof createCouponSchema>;
