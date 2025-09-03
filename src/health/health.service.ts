import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HealthCheckDto } from './dto/health-check.dto';

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async check(): Promise<HealthCheckDto> {
    const startTime = Date.now();

    // Check database connection
    const databaseStatus = await this.checkDatabase();

    const responseTime = Date.now() - startTime;

    return {
      status: databaseStatus.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: databaseStatus,
      },
    };
  }

  async ready(): Promise<HealthCheckDto> {
    return this.check();
  }

  async live(): Promise<HealthCheckDto> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: 0,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {},
    };
  }

  private async checkDatabase(): Promise<{
    healthy: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      await this.databaseService.$queryRaw`SELECT 1`;
      return {
        healthy: true,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}
