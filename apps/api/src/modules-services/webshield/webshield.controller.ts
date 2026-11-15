import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebshieldService } from './webshield.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Module 07 — WebShield (Asset Protection & Vulnerability Auditing)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webshield')
export class WebshieldController {
  constructor(private readonly webshieldService: WebshieldService) {}

  @Post('assets')
  @ApiOperation({ summary: 'Register an enterprise domain asset for security scanning' })
  async registerAsset(
    @CurrentUser('id') userId: string,
    @Body('domain') domain: string,
    @Body('organizationName') orgName?: string,
  ) {
    return this.webshieldService.registerAsset(userId, domain, orgName);
  }

  @Post('assets/:id/verify')
  @ApiOperation({ summary: 'Verify ownership challenge token via DNS TXT' })
  async verifyOwnership(
    @CurrentUser('id') userId: string,
    @Param('id') assetId: string,
  ) {
    return this.webshieldService.verifyAssetOwnership(assetId, userId);
  }

  @Post('assets/:id/scan')
  @ApiOperation({ summary: 'Execute SSRF-safe security scan on verified web asset' })
  async scanAsset(
    @CurrentUser('id') userId: string,
    @Param('id') assetId: string,
  ) {
    return this.webshieldService.scanAsset(assetId, userId);
  }

  @Get('assets')
  @ApiOperation({ summary: 'List all registered assets and latest scan findings' })
  async getAssets(@CurrentUser() user: any) {
    const isPrivileged = user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('SECURITY_ADMIN');
    return this.webshieldService.getAssets(isPrivileged ? undefined : user.id);
  }
}
