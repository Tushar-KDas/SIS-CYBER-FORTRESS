import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SystemService } from './system.service';

@ApiTags('System Health & Diagnostics')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get live health status of backend API, database, cache, and services' })
  async getHealth() {
    return this.systemService.getHealth();
  }

  @Get('diagnostics')
  @ApiOperation({ summary: 'Get real database-backed platform metrics and operational status' })
  async getDiagnostics() {
    return this.systemService.getDiagnostics();
  }
}
