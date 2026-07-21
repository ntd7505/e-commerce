import type { CheckoutDraft } from './cartTypes';

const DRAFT_KEY = 'checkoutDraft';

/**
 * Retrieves the current checkout draft from sessionStorage.
 * If the draft is from the old version (doesn't have a 'type'), it defaults to 'cart'.
 */
export function getCheckoutDraft(): CheckoutDraft | null {
  const data = sessionStorage.getItem(DRAFT_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    // Legacy support: if no type is present, assume it's a cart draft
    if (!parsed.type) {
      if (parsed.cartItemIds) {
        return { ...parsed, type: 'cart' };
      }
      return null;
    }
    return parsed as CheckoutDraft;
  } catch (error) {
    console.error('Failed to parse checkout draft:', error);
    return null;
  }
}

/**
 * Saves the given checkout draft to sessionStorage.
 */
export function saveCheckoutDraft(draft: CheckoutDraft): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/**
 * Clears the checkout draft from sessionStorage.
 */
export function clearCheckoutDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}
