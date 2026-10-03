import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after hydration. Avoids theme-dependent hydration mismatches. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
