import { useQuery } from "@tanstack/react-query";
import { CHECKOUT_STATUS_KEY, fetchCheckoutAvailable } from "@/lib/pricing";

/**
 * Whether the Toolkit can be bought right now, from the same query (and cache entry) the Pricing
 * page uses. Anything that offers to sell the plan shows its price and buy link only when
 * `data === true`; while sales are off (the default) it shows no price call to action.
 */
export function useCheckoutStatus() {
  return useQuery({
    queryKey: CHECKOUT_STATUS_KEY,
    queryFn: fetchCheckoutAvailable,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
