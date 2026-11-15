import { Module } from '@nestjs/common';
import { NetworkSentinelService } from './network-sentinel.service';
import { NetworkSentinelController } from './network-sentinel.controller';

@Module({
  providers: [NetworkSentinelService],
  controllers: [NetworkSentinelController],
  exports: [NetworkSentinelService],
})
export class NetworkSentinelModule {}
