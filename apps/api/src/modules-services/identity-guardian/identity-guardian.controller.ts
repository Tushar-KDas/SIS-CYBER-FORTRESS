import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IdentityGuardianService } from './identity-guardian.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Module 01 — Identity Guardian (Account Protection & Security Score)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('identity')
export class IdentityGuardianController {
  constructor(private readonly identityService: IdentityGuardianService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get account security score breakdown, MFA state, and breach signals' })
  async getOverview(@CurrentUser('id') userId: string) {
    return this.identityService.getAccountSecurityOverview(userId);
  }

  @Get('login-history')
  @ApiOperation({ summary: 'Get authentication history and anomalous access logs' })
  async getLoginHistory(@CurrentUser('id') userId: string) {
    return this.identityService.getLoginHistory(userId);
  }
}
