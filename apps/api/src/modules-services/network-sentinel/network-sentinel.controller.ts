import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NetworkSentinelService } from './network-sentinel.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Module 04 — Network Sentinel (Wi-Fi & Network Security)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('network')
export class NetworkSentinelController {
  constructor(private readonly networkService: NetworkSentinelService) {}

  @Post('snapshots')
  @ApiOperation({ summary: 'Submit network snapshot audit (Agent / Android synchronization)' })
  async submitSnapshot(@Body() body: any) {
    return this.networkService.submitSnapshot(body);
  }

  @Get('snapshots')
  @ApiOperation({ summary: 'List historical network snapshots and risk evaluations' })
  async getSnapshots(@Query('deviceId') deviceId?: string) {
    return this.networkService.getSnapshots(deviceId);
  }

  @Get('checklist')
  @ApiOperation({ summary: 'Get enterprise network security hardening checklist' })
  async getChecklist() {
    return this.networkService.getChecklist();
  }
}
