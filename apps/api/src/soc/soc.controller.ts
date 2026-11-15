import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SocService } from './soc.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, AlertStatus, IncidentStatus, IncidentPriority } from '@sis/api-contracts';

@ApiTags('Security Operations Center (SOC)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('soc')
export class SocController {
  constructor(private readonly socService: SocService) {}

  @Get('overview')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.MODULE_ADMIN, UserRole.AUDITOR, UserRole.USER)
  @ApiOperation({ summary: 'Get unified SOC overview metrics, 7-day trends, and active alerts' })
  async getOverview() {
    return this.socService.getOverview();
  }

  @Get('alerts')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.MODULE_ADMIN, UserRole.AUDITOR, UserRole.USER)
  @ApiOperation({ summary: 'List aggregated security alerts across modules with filters' })
  async getAlerts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('moduleKey') moduleKey?: string,
  ) {
    return this.socService.getAlerts(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
      severity,
      moduleKey,
    );
  }

  @Patch('alerts/:id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Update alert status (UNRESOLVED, INVESTIGATING, RESOLVED, FALSE_POSITIVE)' })
  async updateAlertStatus(
    @Param('id') id: string,
    @Body('status') status: AlertStatus,
    @CurrentUser('id') actorId: string,
  ) {
    return this.socService.updateAlertStatus(id, status, actorId);
  }

  @Get('incidents')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.MODULE_ADMIN, UserRole.AUDITOR, UserRole.USER)
  @ApiOperation({ summary: 'List all formal security incidents with priority and status' })
  async getIncidents(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.socService.getIncidents(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
      priority,
    );
  }

  @Get('incidents/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Get full incident details with alerts, assignments, timeline, and notes' })
  async getIncidentById(@Param('id') id: string) {
    return this.socService.getIncidentById(id);
  }

  @Post('incidents')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Create and declare a new security incident from alerts' })
  async createIncident(
    @Body('title') title: string,
    @Body('summary') summary: string,
    @Body('priority') priority: IncidentPriority,
    @Body('relatedAlertIds') relatedAlertIds: string[],
    @CurrentUser('id') actorId: string,
  ) {
    return this.socService.createIncident(title, summary, priority, relatedAlertIds, actorId);
  }

  @Patch('incidents/:id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Execute state-machine transition on incident (New -> Triaged -> Investigating -> Containment -> Resolved -> Closed)' })
  async updateIncidentStatus(
    @Param('id') id: string,
    @Body('status') status: IncidentStatus,
    @Body('comment') comment: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.socService.updateIncidentStatus(id, status, actorId, comment);
  }

  @Post('incidents/:id/assign')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Assign security analyst to incident' })
  async assignIncident(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.socService.assignIncident(id, userId, actorId);
  }

  @Post('incidents/:id/notes')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN)
  @ApiOperation({ summary: 'Add analyst investigation note to incident timeline' })
  async addNote(
    @Param('id') id: string,
    @Body('note') note: string,
    @CurrentUser('id') authorId: string,
  ) {
    return this.socService.addNote(id, note, authorId);
  }
}
