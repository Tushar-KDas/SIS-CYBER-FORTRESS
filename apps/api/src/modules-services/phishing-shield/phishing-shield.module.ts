import { Module } from '@nestjs/common';
import { PhishingShieldService } from './phishing-shield.service';
import { PhishingShieldController } from './phishing-shield.controller';

@Module({
  providers: [PhishingShieldService],
  controllers: [PhishingShieldController],
  exports: [PhishingShieldService],
})
export class PhishingShieldModule {}
