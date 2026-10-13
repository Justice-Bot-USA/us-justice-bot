/** aria-describedby for a field: its hint (if any) and its error (if any). */
export function describedBy(id: string, hasHint: boolean, error?: string): string | undefined {
  const ids = [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

/** 44px tall inputs with 16px text (no zoom on iPhone). */
export const inputClass = "min-h-11 text-base md:text-base";
export const textareaClass = "text-base md:text-base";

/** Moves focus to a field by id (after a failed submit). */
export function focusField(id: string): void {
  document.getElementById(id)?.focus();
}
