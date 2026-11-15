import { Module } from '@nestjs/common';
import { CloudBackupService } from './cloud-backup.service';
import { CloudBackupController } from './cloud-backup.controller';

@Module({
  providers: [CloudBackupService],
  controllers: [CloudBackupController],
  exports: [CloudBackupService],
})
export class CloudBackupModule {}
