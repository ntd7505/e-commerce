import type { AddressRequest, AddressResponse, AddressType } from "../cart/cartTypes";

export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  HOME: "Nhà riêng",
  OFFICE: "Văn phòng",
  OTHER: "Khác",
};

export const ADDRESS_TYPE_OPTIONS: { value: AddressType; label: string }[] = [
  { value: "HOME", label: "Nhà riêng" },
  { value: "OFFICE", label: "Văn phòng" },
  { value: "OTHER", label: "Khác" },
];

export function getAddressTypeLabel(type: AddressType): string {
  return ADDRESS_TYPE_LABELS[type] ?? type;
}

export function getAddressTypeBadgeClass(type: AddressType): string {
  switch (type) {
    case "HOME":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "OFFICE":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "OTHER":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function createEmptyAddressForm(): AddressRequest {
  return {
    recipientName: "",
    phoneNumber: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    fullAddress: "",
    addressType: "HOME",
    isDefault: false,
  };
}

export function addressToForm(address: AddressResponse): AddressRequest {
  return {
    recipientName: address.recipientName,
    phoneNumber: address.phoneNumber,
    provinceName: address.provinceName,
    districtName: address.districtName,
    wardName: address.wardName,
    fullAddress: address.fullAddress,
    addressType: address.addressType,
    isDefault: address.isDefault,
  };
}

export function buildAddressLine(address: AddressResponse): string {
  return [address.fullAddress, address.wardName, address.districtName, address.provinceName]
    .filter((part) => part && part.trim().length > 0)
    .join(", ");
}

// Vietnamese phone: starts with 0, 10-11 digits total.
const PHONE_REGEX = /^0\d{9,10}$/;

export type AddressFormErrors = Partial<Record<keyof AddressRequest, string>>;

export function validateAddressForm(form: AddressRequest): AddressFormErrors {
  const errors: AddressFormErrors = {};

  if (form.recipientName.trim().length === 0) {
    errors.recipientName = "Vui lòng nhập họ tên người nhận.";
  } else if (form.recipientName.trim().length > 100) {
    errors.recipientName = "Họ tên không được vượt quá 100 ký tự.";
  }

  if (form.phoneNumber.trim().length === 0) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại.";
  } else if (!PHONE_REGEX.test(form.phoneNumber.trim())) {
    errors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0).";
  } else if (form.phoneNumber.trim().length > 20) {
    errors.phoneNumber = "Số điện thoại không được vượt quá 20 ký tự.";
  }

  if (form.provinceName.trim().length === 0) {
    errors.provinceName = "Vui lòng nhập tỉnh/thành phố.";
  } else if (form.provinceName.trim().length > 100) {
    errors.provinceName = "Tỉnh/thành không được vượt quá 100 ký tự.";
  }

  if (form.districtName.trim().length === 0) {
    errors.districtName = "Vui lòng nhập quận/huyện.";
  } else if (form.districtName.trim().length > 100) {
    errors.districtName = "Quận/huyện không được vượt quá 100 ký tự.";
  }

  if (form.wardName.trim().length === 0) {
    errors.wardName = "Vui lòng nhập phường/xã.";
  } else if (form.wardName.trim().length > 100) {
    errors.wardName = "Phường/xã không được vượt quá 100 ký tự.";
  }

  if (form.fullAddress.trim().length === 0) {
    errors.fullAddress = "Vui lòng nhập địa chỉ cụ thể.";
  } else if (form.fullAddress.trim().length > 200) {
    errors.fullAddress = "Địa chỉ không được vượt quá 200 ký tự.";
  }

  if (form.addressType !== "HOME" && form.addressType !== "OFFICE" && form.addressType !== "OTHER") {
    errors.addressType = "Loại địa chỉ không hợp lệ.";
  }

  return errors;
}

export function hasAddressErrors(errors: AddressFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
