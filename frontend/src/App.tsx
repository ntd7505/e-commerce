import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Pages
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
import Login from './pages/admin/Login';
import { RequireAuth } from './features/auth/RequireAuth';
import Coupons from './pages/admin/Coupons';
import ProductMedia from './pages/admin/ProductMedia';
import ProductReviews from './pages/admin/ProductReviews';
import Authority from './pages/admin/Authority';
import Profile from './pages/admin/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<RequireAuth />}>
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
    </BrowserRouter>
  );
}
