/** Lightweight debounce for batching rapid realtime events. */
export function createDebouncer<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number
): { push: (...args: Parameters<T>) => void; flush: () => void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: Parameters<T>[] = [];

  const flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const batch = pending;
    pending = [];
    for (const args of batch) fn(...args);
  };

  return {
    push: (...args: Parameters<T>) => {
      pending.push(args);
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, delayMs);
    },
    flush,
    cancel: () => {
      if (timer) clearTimeout(timer);
      timer = null;
      pending = [];
    },
  };
}
