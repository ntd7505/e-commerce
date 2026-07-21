import { useState, useEffect, useCallback } from 'react';

export type GuestDeliveryLocation = {
  provinceName: string;
  districtName: string;
  wardName?: string;
};

const GUEST_DELIVERY_LOCATION_KEY = "nexamart_guest_delivery_location";

export const useGuestDeliveryLocation = () => {
  const [location, setLocationState] = useState<GuestDeliveryLocation | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUEST_DELIVERY_LOCATION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.provinceName && parsed.districtName) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLocationState({
            provinceName: parsed.provinceName?.trim(),
            districtName: parsed.districtName?.trim(),
            wardName: parsed.wardName?.trim(),
          });
        }
      }
    } catch (error) {
      console.error("Failed to parse guest delivery location", error);
    }
  }, []);

  const setLocation = useCallback((loc: GuestDeliveryLocation) => {
    try {
      const trimmed = {
        provinceName: loc.provinceName.trim(),
        districtName: loc.districtName.trim(),
        wardName: loc.wardName?.trim()
      };
      localStorage.setItem(GUEST_DELIVERY_LOCATION_KEY, JSON.stringify(trimmed));
      setLocationState(trimmed);
    } catch (error) {
      console.error("Failed to save guest delivery location", error);
    }
  }, []);

  const clearLocation = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_DELIVERY_LOCATION_KEY);
      setLocationState(null);
    } catch (error) {
      console.error("Failed to clear guest delivery location", error);
    }
  }, []);

  return { location, setLocation, clearLocation };
};
