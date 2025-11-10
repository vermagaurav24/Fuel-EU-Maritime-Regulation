import { GetAllRoutes } from '../../../src/core/use-cases/routes/GetAllRoutes';
import { MockRouteRepository } from '../../helpers/mockRepositories';
import { mockRoutes } from '../../helpers/testData';

describe('GetAllRoutes Use Case', () => {
  let useCase: GetAllRoutes;
  let repository: MockRouteRepository;

  beforeEach(() => {
    repository = new MockRouteRepository(mockRoutes);
    useCase = new GetAllRoutes(repository);
  });

  it('should return all routes without filter', async () => {
    const routes = await useCase.execute();
    
    expect(routes).toHaveLength(3);
    expect(routes[0].routeId).toBe('R001');
  });

  it('should filter by vessel type', async () => {
    const routes = await useCase.execute({ vesselType: 'Container' });
    
    expect(routes).toHaveLength(1);
    expect(routes[0].vesselType).toBe('Container');
  });

  it('should filter by fuel type', async () => {
    const routes = await useCase.execute({ fuelType: 'LNG' });
    
    expect(routes).toHaveLength(1);
    expect(routes[0].fuelType).toBe('LNG');
  });

  it('should filter by year', async () => {
    const routes = await useCase.execute({ year: 2024 });
    
    expect(routes).toHaveLength(3);
    routes.forEach(route => {
      expect(route.year).toBe(2024);
    });
  });

  it('should combine multiple filters', async () => {
    const routes = await useCase.execute({
      vesselType: 'Container',
      year: 2024,
    });
    
    expect(routes).toHaveLength(1);
    expect(routes[0].routeId).toBe('R001');
  });
});