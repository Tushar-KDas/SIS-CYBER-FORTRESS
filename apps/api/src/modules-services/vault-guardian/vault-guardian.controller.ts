import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VaultGuardianService, CreateVaultItemInput } from './vault-guardian.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Module 05 — Vault Guardian (Zero-Knowledge E2EE)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vault')
export class VaultGuardianController {
  constructor(private readonly vaultService: VaultGuardianService) {}

  @Post('items')
  @ApiOperation({ summary: 'Store encrypted client-side ciphertext (Zero-Knowledge)' })
  async create(@CurrentUser('id') userId: string, @Body() body: CreateVaultItemInput) {
    return this.vaultService.create(userId, body);
  }

  @Get('items')
  @ApiOperation({ summary: 'Retrieve all encrypted items for current authenticated user' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.vaultService.findAll(userId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Retrieve specific encrypted item' })
  async findById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vaultService.findById(userId, id);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update encrypted vault item' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateVaultItemInput>,
  ) {
    return this.vaultService.update(userId, id, body);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Permanently remove encrypted vault item' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vaultService.delete(userId, id);
  }
}
