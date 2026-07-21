import type { User } from './authTypes';

export function hasRole(user: User | null | undefined, roleName: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.name === roleName);
}

export function hasPermission(user: User | null | undefined, permissionName: string): boolean {
  if (!user || !user.roles) return false;
  // If user is ADMIN, they bypass permission checks
  if (hasRole(user, 'ADMIN')) return true;

  return user.roles.some((role) => 
    role.permissions?.some((permission) => permission.name === permissionName)
  );
}

export function canAccessAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'ADMIN') || hasRole(user, 'STAFF');
}

export function getFirstAdminRoute(user: User | null | undefined): string {
  if (hasRole(user, 'ADMIN')) {
    return '/admin/dashboard';
  }
  if (hasRole(user, 'STAFF')) {
    // If we wanted to be perfectly dynamic we'd check their permissions,
    // but the requirement says STAFF goes to orders if not authorized or by default
    return '/admin/orders';
  }
  return '/';
}
