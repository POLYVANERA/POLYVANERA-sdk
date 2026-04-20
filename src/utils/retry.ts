/**
 * Retry a function with exponential backoff.
 * 
 * @param fn - The async function to retry
 * @param opts - Retry options (retries, delayMs)
 * @returns Promise resolving to the function's return value
 * @throws The last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; delayMs?: number } = {}
): Promise<T> {
  const { retries = 3, delayMs = 300 } = opts;
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i === retries) break;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
}
