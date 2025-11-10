import { RouteRepository } from '../../../adapters/outbound/persistence/repositories/RouteRepository';

export class SetBaseline {
  constructor(private routeRepository: RouteRepository) {}

  async execute(routeId: string, baselineData: any = {}) {
    return await this.routeRepository.updateBaseline(routeId, baselineData);
  }
}
