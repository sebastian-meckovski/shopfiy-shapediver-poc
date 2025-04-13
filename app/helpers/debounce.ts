export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecutionTime: number | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (lastExecutionTime === null || now - lastExecutionTime >= delay) {
      func(...args);
      lastExecutionTime = now;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecutionTime = Date.now();
        },
        delay - (now - lastExecutionTime)
      );
    }
  };
}
