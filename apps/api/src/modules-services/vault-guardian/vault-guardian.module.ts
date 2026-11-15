import { Module } from '@nestjs/common';
import { VaultGuardianService } from './vault-guardian.service';
import { VaultGuardianController } from './vault-guardian.controller';

@Module({
  providers: [VaultGuardianService],
  controllers: [VaultGuardianController],
  exports: [VaultGuardianService],
})
export class VaultGuardianModule {}
