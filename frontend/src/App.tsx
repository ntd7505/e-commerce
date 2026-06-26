import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/admin/AdminLayout';
import ClientLayout from './layouts/client/ClientLayout';
import { AuthProvider } from './features/auth/AuthProvider';
import { CartProvider } from './features/client/cart/CartProvider';
import { ToastProvider } from './features/ui/ToastProvider';

// Pages
import Home from './pages/client/Home';
import ClientLogin from './pages/client/Login';
import ClientRegister from './pages/client/Register';
import ProductList from './pages/client/ProductList';
import ProductDetail from './pages/client/ProductDetail';
import Account from './pages/client/Account';
import AccountOrders from './pages/client/AccountOrders';
import AccountOrderDetail from './pages/client/AccountOrderDetail';
import AccountAddresses from './pages/client/AccountAddresses';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import CheckoutSuccess from './pages/client/CheckoutSuccess';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Transactions from './pages/admin/Transactions';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import Settings from './pages/admin/Settings';
import Categories from './pages/admin/Categories';
import AdminRole from './pages/admin/AdminRole';
import Brands from './pages/admin/Brands';
import AdminLogin from './pages/admin/Login';
import { RequireAdmin, RequireAuth } from './features/auth/RequireAuth';
import Coupons from './pages/admin/Coupons';
import ProductMedia from './pages/admin/ProductMedia';
import ProductReviews from './pages/admin/ProductReviews';
import Authority from './pages/admin/Authority';
import Profile from './pages/admin/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
          {/* Client Routes (Trang dành cho khách hàng) */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<ClientLogin />} />
            <Route path="register" element={<ClientRegister />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route element={<RequireAuth />}>
              <Route path="account" element={<Account />} />
              <Route path="account/orders" element={<AccountOrders />} />
              <Route path="account/orders/:id" element={<AccountOrderDetail />} />
              <Route path="account/addresses" element={<AccountAddresses />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkout/success/:orderId" element={<CheckoutSuccess />} />
            </Route>
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/:id/edit" element={<AddProduct />} />
              <Route path="products/media" element={<ProductMedia />} />
              <Route path="products/reviews" element={<ProductReviews />} />
              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="roles" element={<AdminRole />} />
              <Route path="authority" element={<Authority />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
