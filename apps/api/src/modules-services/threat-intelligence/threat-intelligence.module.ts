import { Module } from '@nestjs/common';
import { ThreatIntelligenceService } from './threat-intelligence.service';
import { ThreatIntelligenceController } from './threat-intelligence.controller';

@Module({
  providers: [ThreatIntelligenceService],
  controllers: [ThreatIntelligenceController],
  exports: [ThreatIntelligenceService],
})
export class ThreatIntelligenceModule {}
