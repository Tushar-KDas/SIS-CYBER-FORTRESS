import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CloudBackupService } from './cloud-backup.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Module 11 — Cloud Backup Guardian (Encrypted Storage & Integrity)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('backups')
export class CloudBackupController {
  constructor(private readonly backupService: CloudBackupService) {}

  @Get('jobs')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all automated backup jobs and encryption state' })
  async findAllJobs() {
    return this.backupService.findAllJobs();
  }

  @Post('jobs')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create and run an encrypted backup job' })
  async createJob(
    @Body('name') name: string,
    @Body('targetType') targetType?: string,
  ) {
    return this.backupService.createBackupJob(name, targetType);
  }

  @Get(':id/integrity')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Verify cryptographic SHA-256 integrity of backup archive' })
  async verifyIntegrity(@Param('id') id: string) {
    return this.backupService.verifyIntegrity(id);
  }

  @Post(':id/restore')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Trigger restoration workflow for verified backup' })
  async restore(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.backupService.triggerRestore(id, userId);
  }
}
