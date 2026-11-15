import { Module } from '@nestjs/common';
import { WebshieldService } from './webshield.service';
import { WebshieldController } from './webshield.controller';

@Module({
  providers: [WebshieldService],
  controllers: [WebshieldController],
  exports: [WebshieldService],
})
export class WebshieldModule {}
