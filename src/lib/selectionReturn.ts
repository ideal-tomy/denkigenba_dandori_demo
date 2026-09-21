export const SELECTION_FROM = "axeon-demo-selection";
export const SELECTION_DETAIL_URL =
  "https://axeon-demo-selection.vercel.app/?demo=field-dandori";

const STORAGE_KEY = "field-dandori-from-selection";

export function syncSelectionEntry() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("from") === SELECTION_FROM) {
    sessionStorage.setItem(STORAGE_KEY, "1");
  }
}

export function hasSelectionEntry(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function selectionReturnUrl(): string | null {
  return hasSelectionEntry() ? SELECTION_DETAIL_URL : null;
}
