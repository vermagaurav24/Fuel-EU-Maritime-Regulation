import request from 'supertest';
import { Application } from 'express';
import App from '../../../src/app';

describe('Banking API Integration Tests', () => {
  let app: Application;
  let server: App;

  beforeAll(() => {
    server = new App();
    app = server.app;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /api/banking/bank', () => {
    it('should bank surplus successfully', async () => {
      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP001',
          year: 2024,
          amount: 1000,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amountGco2eq).toBe(1000);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP001',
          // Missing year and amount
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/banking/apply', () => {
    it('should apply banked surplus successfully', async () => {
      const response = await request(app)
        .post('/api/banking/apply')
        .send({
          shipId: 'SHIP001',
          year: 2024,
          amount: 500,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cbBefore');
      expect(response.body.data).toHaveProperty('applied');
      expect(response.body.data).toHaveProperty('cbAfter');
    });
  });

  describe('GET /api/banking/records', () => {
    it('should return bank records for a ship', async () => {
      const response = await request(app)
        .get('/api/banking/records')
        .query({ shipId: 'SHIP001' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('records');
      expect(response.body.data).toHaveProperty('totalAvailable');
    });

    it('should return 400 when shipId is missing', async () => {
      const response = await request(app).get('/api/banking/records');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});