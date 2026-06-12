export type PermissionResponse = {
  name: string;
  description?: string | null;
};

export type RoleResponse = {
  name: string;
  description?: string | null;
  permissions: PermissionResponse[];
};

export type RoleCreateRequest = {
  name: string;
  description: string;
  permissions: string[];
};
