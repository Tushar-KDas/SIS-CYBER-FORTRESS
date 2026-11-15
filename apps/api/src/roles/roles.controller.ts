import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all platform roles and permission sets' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all defined granular permission keys' })
  async findPermissions() {
    return this.rolesService.findPermissions();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get role details and associated permissions' })
  async findById(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }
}
