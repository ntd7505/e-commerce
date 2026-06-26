import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthProvider";
import { cartApi } from "../../cart/cartApi";
import type { AddressResponse } from "../../cart/cartTypes";

const FALLBACK_LABEL = "TP. Hồ Chí Minh";

function buildAddressLabel(address: AddressResponse): string {
  const district = address.districtName?.trim();
  const province = address.provinceName?.trim();
  if (district && province) return `${district}, ${province}`;
  if (province) return province;
  if (district) return district;
  return FALLBACK_LABEL;
}

export function useDefaultShippingAddressLabel(): string {
  const { isAuthenticated } = useAuth();
  const [label, setLabel] = useState<string>(FALLBACK_LABEL);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    async function load() {
      try {
        const data = await cartApi.getAddresses();
        if (cancelled) return;
        const active = data.filter((addr) => !addr.deleted);
        if (active.length === 0) {
          setLabel(FALLBACK_LABEL);
          return;
        }
        const defaultOrFirst = active.find((a) => a.isDefault) ?? active[0];
        setLabel(buildAddressLabel(defaultOrFirst));
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load default shipping address:", err);
        setLabel(FALLBACK_LABEL);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return label;
}