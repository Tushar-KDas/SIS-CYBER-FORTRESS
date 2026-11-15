import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThreatIntelligenceService } from './threat-intelligence.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Module 10 — Threat Intelligence (IOC Management & Feeds)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('threat-intel')
export class ThreatIntelligenceController {
  constructor(private readonly threatService: ThreatIntelligenceService) {}

  @Get('indicators')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List Indicators of Compromise (IPs, Domains, URLs, Hashes)' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('severity') severity?: string,
  ) {
    return this.threatService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      type,
      severity,
    );
  }

  @Get('search')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Fast search across IOC database by IP, domain, hash, or tag' })
  async search(@Query('q') query: string) {
    return this.threatService.search(query || '');
  }

  @Post('indicators')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Add or update an Indicator of Compromise (IOC)' })
  async createIndicator(@Body() body: any) {
    return this.threatService.createIndicator(body);
  }

  @Post('feeds/sync')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Trigger synchronization of external threat intelligence feeds' })
  async syncFeeds() {
    return this.threatService.syncFeeds();
  }
}
