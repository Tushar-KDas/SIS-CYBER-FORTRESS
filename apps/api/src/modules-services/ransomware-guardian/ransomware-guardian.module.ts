import { Module } from '@nestjs/common';
import { RansomwareGuardianService } from './ransomware-guardian.service';
import { RansomwareGuardianController } from './ransomware-guardian.controller';

@Module({
  providers: [RansomwareGuardianService],
  controllers: [RansomwareGuardianController],
  exports: [RansomwareGuardianService],
})
export class RansomwareGuardianModule {}
