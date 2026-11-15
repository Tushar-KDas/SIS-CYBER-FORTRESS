import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ModuleAccessGuard } from '../common/guards/module-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Cybersecurity Modules Catalog & Configuration')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'List all 12 cybersecurity modules with real status' })
  async findAll() {
    return this.modulesService.findAll();
  }

  @Get(':moduleKey')
  @ApiOperation({ summary: 'Get details, status, and recent activity of a specific module' })
  async findByKey(@Param('moduleKey') moduleKey: string) {
    return this.modulesService.findByKey(moduleKey);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, ModuleAccessGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODULE_ADMIN)
  @Patch(':moduleKey/settings')
  @ApiOperation({ summary: 'Update module settings (Requires Super Admin or assigned Module Admin)' })
  async updateSettings(
    @Param('moduleKey') moduleKey: string,
    @Body('settings') settings: Record<string, any>,
    @CurrentUser('id') actorId: string,
  ) {
    return this.modulesService.updateSettings(moduleKey, JSON.stringify(settings), actorId);
  }
}
