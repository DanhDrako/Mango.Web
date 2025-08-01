const Apis = {
  API_TYPE: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  },
  URL_BASE: {
    MAIN: import.meta.env.VITE_API_URL,
    COUPON: import.meta.env.VITE_COUPON_API_URL,
    AUTH: import.meta.env.VITE_AUTH_API_URL,
    PRODUCT: import.meta.env.VITE_PRODUCT_API_URL,
    CART: import.meta.env.VITE_CART_API_URL,
    ORDER: import.meta.env.VITE_ORDER_API_URL,
    PAYMENT: import.meta.env.VITE_PAYMENT_API_URL
  },
  API_TAILER: {
    COUPON: '/coupon',
    AUTH: '/auth',
    PRODUCT: '/product',
    CATEGORY: '/category',
    BRAND: '/brand',
    CART: '/cart',
    ORDER: '/order',
    PAYMENT: '/payment',
    BUGGY: '/buggy'
  },
  API_VERSION: {
    V1: 'v1/',
    V2: 'v2/'
  }
};

export default Apis;
