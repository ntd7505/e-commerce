import { useCallback, useEffect, useState } from "react";
import { cartApi } from "../../cart/cartApi";
import type { AddressRequest, AddressResponse } from "../../cart/cartTypes";

export type UseAddressesReturn = {
  addresses: AddressResponse[];
  loading: boolean;
  error: string;
  submitting: boolean;
  deletingId: number | null;
  settingDefaultId: number | null;
  refresh: () => void;
  createAddress: (payload: AddressRequest) => Promise<boolean>;
  updateAddress: (id: number, payload: AddressRequest) => Promise<boolean>;
  removeAddress: (id: number) => Promise<boolean>;
  setDefaultAddress: (address: AddressResponse) => Promise<boolean>;
};

export function useAddresses(): UseAddressesReturn {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  const refresh = useCallback(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await cartApi.getAddresses();
        if (cancelled) return;
        setAddresses(data.filter((addr) => !addr.deleted));
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load addresses:", err);
        setError("Không thể tải danh sách địa chỉ. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = refresh();
    return cancel;
  }, [refresh]);

  const createAddress = useCallback(async (payload: AddressRequest): Promise<boolean> => {
    try {
      setSubmitting(true);
      await cartApi.createAddress(payload);
      refresh();
      return true;
    } catch (err) {
      console.error("Failed to create address:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [refresh]);

  const updateAddress = useCallback(
    async (id: number, payload: AddressRequest): Promise<boolean> => {
      try {
        setSubmitting(true);
        await cartApi.updateAddress(id, payload);
        refresh();
        return true;
      } catch (err) {
        console.error("Failed to update address:", err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const removeAddress = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setDeletingId(id);
        await cartApi.deleteAddress(id);
        refresh();
        return true;
      } catch (err) {
        console.error("Failed to delete address:", err);
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [refresh],
  );

  const setDefaultAddress = useCallback(
    async (address: AddressResponse): Promise<boolean> => {
      try {
        setSettingDefaultId(address.id);
        const payload: AddressRequest = {
          recipientName: address.recipientName,
          phoneNumber: address.phoneNumber,
          provinceName: address.provinceName,
          districtName: address.districtName,
          wardName: address.wardName,
          fullAddress: address.fullAddress,
          addressType: address.addressType,
          isDefault: true,
        };
        await cartApi.updateAddress(address.id, payload);
        refresh();
        return true;
      } catch (err) {
        console.error("Failed to set default address:", err);
        throw err;
      } finally {
        setSettingDefaultId(null);
      }
    },
    [refresh],
  );

  return {
    addresses,
    loading,
    error,
    submitting,
    deletingId,
    settingDefaultId,
    refresh,
    createAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  };
}
