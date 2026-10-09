/** Sign-in URL that brings the user back to `returnTo` (default: the current page) afterwards. */
export function signInPath(returnTo?: string): string {
  const target = returnTo ?? `${window.location.pathname}${window.location.search}`;
  return `/auth?redirect=${encodeURIComponent(target)}`;
}
