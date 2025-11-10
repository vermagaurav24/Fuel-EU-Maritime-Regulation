import { SetBaseline } from '../../../src/core/use-cases/routes/SetBaseline';
import { MockRouteRepository } from '../../helpers/mockRepositories';
import { mockRoutes } from '../../helpers/testData';

describe('SetBaseline Use Case', () => {
  let useCase: SetBaseline;
  let repository: MockRouteRepository;

  beforeEach(() => {
    repository = new MockRouteRepository(mockRoutes);
    useCase = new SetBaseline(repository as any);
  });

  it('should set a route as baseline', async () => {
    const result = await useCase.execute('R002');
    
    expect(result.isBaseline).toBe(true);
    expect(result.routeId).toBe('R002');
  });

  it('should remove baseline from previous baseline route', async () => {
    // R001 is initially baseline
    await useCase.execute('R002');
    
    const oldBaseline = await repository.findByRouteId('R001');
    expect(oldBaseline?.isBaseline).toBe(false);
  });

  it('should throw error for non-existent route', async () => {
    await expect(useCase.execute('R999')).rejects.toThrow('Route R999 not found');
  });
});