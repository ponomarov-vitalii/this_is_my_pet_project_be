import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({
    description: 'Overall health status',
    example: 'healthy',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Application uptime in seconds',
    example: 3600,
  })
  uptime: number;

  @ApiProperty({
    description: 'Response time in milliseconds',
    example: 50,
  })
  responseTime: number;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Environment',
    example: 'development',
  })
  environment: string;

  @ApiProperty({
    description: 'Detailed health checks',
    example: {
      database: {
        healthy: true,
        responseTime: 10,
      },
    },
  })
  checks: Record<string, unknown>;
}
