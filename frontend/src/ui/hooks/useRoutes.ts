import { useState, useEffect } from 'react';
import { RouteRepository } from '../../infrastructure/api/repositories/RouteRepository';
import type { RouteDTO, RouteFilterDTO } from '../../core/application/dto/RouteDTO';

const routeRepository = new RouteRepository();

export const useRoutes = (initialFilter?: RouteFilterDTO): {
  routes: RouteDTO[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: RouteFilterDTO) => Promise<void>;
  setBaseline: (routeId: string) => Promise<void>;
} => {
  const [routes, setRoutes] = useState<RouteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async (filter?: RouteFilterDTO) => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeRepository.findAll(filter ?? initialFilter);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      await routeRepository.setBaseline(routeId);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
    }
  };

  useEffect(() => {
    void fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    routes,
    loading,
    error,
    refetch: fetchRoutes,
    setBaseline,
  };
};