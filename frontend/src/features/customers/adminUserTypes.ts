import type { RoleResponse } from "../roles/adminRoleTypes";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type AdminUserResponse = {
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  status: UserStatus;
  roles: RoleResponse[];
};
