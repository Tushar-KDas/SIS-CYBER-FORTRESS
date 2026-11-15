import { Module } from '@nestjs/common';
import { DigitalForensicsService } from './digital-forensics.service';
import { DigitalForensicsController } from './digital-forensics.controller';

@Module({
  providers: [DigitalForensicsService],
  controllers: [DigitalForensicsController],
  exports: [DigitalForensicsService],
})
export class DigitalForensicsModule {}
