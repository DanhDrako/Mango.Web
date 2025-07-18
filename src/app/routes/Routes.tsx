import { createBrowserRouter, Navigate } from 'react-router';
import App from '../layout/App';
import AboutPage from '../../features/about/AboutPage';
import HomePage from '../../features/home/HomePage';
import ContactPage from '../../features/contact/ContactPage';
import ProductDetails from '../../features/catalog/ProductDetails';
import Catalog from '../../features/catalog/Catalog';
import ServerError from '../errors/ServerError';
import NotFound from '../errors/NotFound';
import CartPage from '../../features/cart/CartPage';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import LoginForm from '../../features/auth/LoginForm';
import RegisterForm from '../../features/auth/RegisterForm';
import RequireAuth from './RequireAuth';
import CheckoutSuccess from '../../features/checkout/CheckoutSuccess';
import OrdersPage from '../../features/order/OrdersPage';
import OrderDetailedPage from '../../features/order/OrderDetailedPage';
import InventoryPage from '../../features/admin/product/InventoryPage';
import Coupons from '../../features/admin/coupon/CouponsPage';
import CouponDetailedPage from '../../features/admin/coupon/CouponDetailedPage';
import FilterPage from '../../features/admin/filter/FilterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'checkout/success', element: <CheckoutSuccess /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailedPage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'coupons', element: <Coupons /> },
          { path: 'coupon/:id', element: <CouponDetailedPage /> },
          { path: 'filters', element: <FilterPage /> }
        ]
      },
      { path: '', element: <HomePage /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <ProductDetails /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'server-error', element: <ServerError /> },
      { path: 'not-found', element: <NotFound /> },
      { path: '*', element: <Navigate replace to="/not-found" /> }
    ]
  }
]);
