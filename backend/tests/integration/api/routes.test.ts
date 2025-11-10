// @ts-nocheck
import request from 'supertest';
import { Application } from 'express';
import App from '../../../src/app';

describe('Routes API Integration Tests', () => {
  let app: Application;
  let server: App;

  beforeAll(() => {
    server = new App();
    app = server.app;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/routes', () => {
    it('should return all routes', async () => {
      const response = await request(app).get('/api/routes');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should filter routes by vessel type', async () => {
      const response = await request(app)
        .get('/api/routes')
        .query({ vesselType: 'Container' });

      expect(response.status).toBe(200);
      expect(response.body.data.every((r: any) => r.vesselType === 'Container')).toBe(true);
    });

    it('should filter routes by year', async () => {
      const response = await request(app)
        .get('/api/routes')
        .query({ year: 2024 });

      expect(response.status).toBe(200);
      expect(response.body.data.every((r: any) => r.year === 2024)).toBe(true);
    });
  });

  describe('POST /api/routes/:routeId/baseline', () => {
    it('should set a route as baseline', async () => {
      const response = await request(app).post('/api/routes/R002/baseline');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isBaseline).toBe(true);
    });

    it('should return 404 for non-existent route', async () => {
      const response = await request(app).post('/api/routes/R999/baseline');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/routes/comparison', () => {
    it('should return comparison data', async () => {
      const response = await request(app).get('/api/routes/comparison');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('baseline');
      expect(response.body.data).toHaveProperty('comparisons');
      expect(response.body.data.comparisons).toBeInstanceOf(Array);
    });

    it('should include percent difference and compliance status', async () => {
      const response = await request(app).get('/api/routes/comparison');

      const comparison = response.body.data.comparisons[0];
      expect(comparison).toHaveProperty('percentDiff');
      expect(comparison).toHaveProperty('compliant');
    });
  });
});