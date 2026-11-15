import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Reporting & Executive Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Get enterprise executive security metrics and compliance score' })
  async getSummary() {
    return this.reportsService.getExecutiveSummary();
  }

  @Get('export')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Export structured cybersecurity reporting dataset' })
  async exportData() {
    return this.reportsService.exportReportData();
  }
}
