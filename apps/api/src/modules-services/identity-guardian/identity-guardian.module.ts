import { Module } from '@nestjs/common';
import { IdentityGuardianService } from './identity-guardian.service';
import { IdentityGuardianController } from './identity-guardian.controller';

@Module({
  providers: [IdentityGuardianService],
  controllers: [IdentityGuardianController],
  exports: [IdentityGuardianService],
})
export class IdentityGuardianModule {}
