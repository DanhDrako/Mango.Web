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
