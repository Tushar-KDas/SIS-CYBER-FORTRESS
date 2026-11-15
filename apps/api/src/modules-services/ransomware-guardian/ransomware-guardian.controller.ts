import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RansomwareGuardianService } from './ransomware-guardian.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Module 06 — Ransomware Guardian')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ransomware')
export class RansomwareGuardianController {
  constructor(private readonly ransomwareService: RansomwareGuardianService) {}

  @Get('readiness')
  @ApiOperation({ summary: 'Get enterprise ransomware recovery readiness score & metrics' })
  async getReadiness() {
    return this.ransomwareService.getReadinessOverview();
  }

  @Post('verify-file')
  @ApiOperation({ summary: 'Verify cryptographic SHA-256 hash against tamper baseline' })
  async verifyFile(
    @Body('fileName') fileName: string,
    @Body('expectedHash') expectedHash: string,
    @Body('actualContentBase64') actualContentBase64: string,
  ) {
    return this.ransomwareService.verifyFileIntegrity(fileName, expectedHash, actualContentBase64);
  }
}
