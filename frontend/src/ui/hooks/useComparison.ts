import { useState, useEffect } from 'react';
import { RouteRepository } from '../../infrastructure/api/repositories/RouteRepository';
import type { ComparisonResponseDTO } from '../../core/application/dto/ComparisonDTO';

const routeRepository = new RouteRepository();

export const useComparison = (): {
  data: ComparisonResponseDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [data, setData] = useState<ComparisonResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await routeRepository.getComparison();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchComparison();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchComparison,
  };
};