import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PhishingShieldService } from './phishing-shield.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Module 02 — Phishing Shield')
@Controller('phishing')
export class PhishingShieldController {
  constructor(private readonly phishingService: PhishingShieldService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Analyze URL with SSRF protection, domain reputation, and heuristics' })
  async scanUrl(@Body('url') url: string, @Body('userId') userId?: string) {
    return this.phishingService.analyzeUrl(url, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('scans')
  @ApiOperation({ summary: 'Get scan history for user or enterprise' })
  async getScanHistory(@CurrentUser('id') userId: string) {
    return this.phishingService.getScanHistory(userId);
  }

  @Post('report')
  @ApiOperation({ summary: 'Submit user threat report for suspicious URL or phishing email' })
  async submitReport(
    @Body('targetUrl') targetUrl: string,
    @Body('category') category: string,
    @Body('comment') comment?: string,
    @Body('submittedBy') submittedBy?: string,
  ) {
    return this.phishingService.submitThreatReport(targetUrl, category, comment, submittedBy);
  }
}
