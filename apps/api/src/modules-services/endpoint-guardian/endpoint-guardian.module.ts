import { Module } from '@nestjs/common';
import { EndpointGuardianService } from './endpoint-guardian.service';
import { EndpointGuardianController } from './endpoint-guardian.controller';

@Module({
  providers: [EndpointGuardianService],
  controllers: [EndpointGuardianController],
  exports: [EndpointGuardianService],
})
export class EndpointGuardianModule {}
