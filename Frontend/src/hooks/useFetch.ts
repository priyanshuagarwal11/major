import { useEffect, useState } from 'react';

export function useFetch<T>(request: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await request();
        if (isActive) setData(result);
      } catch (err) {
        if (isActive) setError((err as Error).message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    run();

    return () => {
      isActive = false;
    };
  }, [request]);

  return { data, isLoading, error };
}
