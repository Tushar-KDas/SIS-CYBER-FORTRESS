import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EndpointGuardianService } from './endpoint-guardian.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Module 03 — Endpoint Guardian')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class EndpointGuardianController {
  constructor(private readonly endpointService: EndpointGuardianService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new endpoint device' })
  async registerDevice(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.endpointService.registerDevice(userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List all enrolled devices for current user or enterprise' })
  async findAll(@CurrentUser() user: any) {
    const isPrivileged = user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('SECURITY_ADMIN');
    return this.endpointService.findAll(isPrivileged ? undefined : user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device telemetry and security posture snapshots' })
  async findById(@Param('id') id: string) {
    return this.endpointService.findById(id);
  }

  @Post(':id/telemetry')
  @ApiOperation({ summary: 'Submit device telemetry snapshot (Android/Desktop agent sync)' })
  async recordTelemetry(@Param('id') id: string, @Body() body: any) {
    return this.endpointService.recordTelemetry(id, body);
  }
}
