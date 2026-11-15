import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DigitalForensicsService } from './digital-forensics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Module 08 — Digital Forensics (Evidence & Chain-of-Custody)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('forensics')
export class DigitalForensicsController {
  constructor(private readonly forensicsService: DigitalForensicsService) {}

  @Post('cases')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Open a new digital forensic investigation case' })
  async createCase(
    @Body('title') title: string,
    @Body('description') description: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.forensicsService.createCase(title, description, actorId);
  }

  @Get('cases')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all active forensic cases with evidence count' })
  async findAllCases() {
    return this.forensicsService.findAllCases();
  }

  @Get('cases/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Get full forensic case file, evidence records, and chain-of-custody' })
  async findCaseById(@Param('id') id: string) {
    return this.forensicsService.findCaseById(id);
  }

  @Post('cases/:id/evidence')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Ingest evidence file, compute SHA-256 hash, and initiate custody chain' })
  async addEvidence(
    @Param('id') caseId: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.forensicsService.addEvidence(caseId, userId, body);
  }

  @Post('cases/:id/evidence/:evidenceId/custody')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Transfer custody with append-only tamper-evident verification' })
  async transferCustody(
    @Param('id') caseId: string,
    @Param('evidenceId') evidenceId: string,
    @CurrentUser('id') userId: string,
    @Body('newCustodian') newCustodian: string,
    @Body('reason') reason: string,
  ) {
    return this.forensicsService.transferCustody(caseId, evidenceId, userId, newCustodian, reason);
  }
}
