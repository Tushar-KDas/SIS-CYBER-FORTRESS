import {
  Controller,
  Get,
  Patch,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@sis/api-contracts';

@ApiTags('User Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all enterprise users with pagination and search' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECURITY_ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Get detailed user record including roles, devices, and sessions' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user account status (ACTIVE, SUSPENDED)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.updateStatus(id, status, actorId);
  }

  @Put(':id/roles')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign RBAC roles to a user' })
  async assignRoles(
    @Param('id') id: string,
    @Body('roles') roles: string[],
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.assignRoles(id, roles, actorId);
  }

  @Put(':id/modules')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign explicit modules to a MODULE_ADMIN user' })
  async assignModules(
    @Param('id') id: string,
    @Body('moduleKeys') moduleKeys: string[],
    @Body('canWrite') canWrite: boolean,
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.assignModules(id, moduleKeys, canWrite ?? true, actorId);
  }
}
