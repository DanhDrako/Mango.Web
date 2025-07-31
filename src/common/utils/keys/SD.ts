export const SD = {
  RolesUser: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER'
  },
  TokenCookie: 'JWTToken'
};

export const OrderStatus = {
  Pending: 0,
  PaymentLater: 1,
  PaymentReceived: 2,
  PaymentFailed: 3,
  PaymentMismatch: 4,
  Shipped: 5,
  Delivered: 6,
  Cancelled: 7,
  Refunded: 8
};

export const OrderStatusText = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.PaymentLater]: 'Payment Later',
  [OrderStatus.PaymentReceived]: 'Payment Received',
  [OrderStatus.PaymentFailed]: 'Payment Failed',
  [OrderStatus.PaymentMismatch]: 'Payment Mismatch',
  [OrderStatus.Shipped]: 'Shipped',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
  [OrderStatus.Refunded]: 'Refunded'
};
