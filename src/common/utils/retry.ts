export async function retryOnConflict<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e: any) {
      // P2002 = unique constraint violation, P2034 = serialization failure
      if ((e?.code === 'P2002' || e?.code === 'P2034') && i < maxAttempts - 1) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}
