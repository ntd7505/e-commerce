import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <Outlet />;
}

export function RequireAdmin() {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.roles?.some(r => r.name === "ADMIN" || r.name === "STAFF")) {
    return <Navigate to="/" replace />;
  }

  // Prevent accessing /admin exactly if they should go to dashboard or orders
  if (location.pathname === "/admin") {
    if (user.roles.some(r => r.name === "ADMIN")) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/admin/orders" replace />;
    }
  }

  return <Outlet />;
}

export function RequirePermission({ permission, adminOnly = false }: { permission?: string; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.roles?.some(r => r.name === "ADMIN");
  
  if (adminOnly && !isAdmin) {
    // If it's admin only and user is staff, redirect to their home
    return <Navigate to="/admin/orders" replace />;
  }

  if (!isAdmin && permission) {
    const hasPerm = user.roles?.some(role => 
      role.permissions?.some(p => p.name === permission)
    );
    if (!hasPerm) {
      return <Navigate to="/admin/orders" replace />;
    }
  }

  return <Outlet />;
}
