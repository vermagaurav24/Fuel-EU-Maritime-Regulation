import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Container } from './adapters/container';
import { setupRoutes } from './adapters/inbound/http/routes';
import { errorHandler, notFoundHandler } from './adapters/inbound/middleware/errorHandler';
import { requestLogger, corsOptions } from './adapters/inbound/middleware/validation';

// Load environment variables
dotenv.config();

/**
 * Main Application Class
 */
class App {
  public app: Application;
  private container: Container;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    this.container = new Container();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize Express middlewares
   */
  private initializeMiddlewares(): void {
    // CORS
    this.app.use(cors(corsOptions));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use(requestLogger);
  }

  /**
   * Initialize application routes
   */
  private initializeRoutes(): void {
    const router = setupRoutes(
      this.container.routeController,
      this.container.complianceController,
      this.container.bankingController,
      this.container.poolingController
    );

    this.app.use('/api', router);
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log('FuelEU Maritime Backend Server');
      console.log(`Server running on http://localhost:${this.port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Base: http://localhost:${this.port}/api`);
    });
  }

  /**
   * Graceful shutdown
   */
  public async close(): Promise<void> {
    await this.container.close();
  }
}

// Create and start application
const application = new App();
application.listen();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await application.close();
  process.exit(0);
});

export default App;