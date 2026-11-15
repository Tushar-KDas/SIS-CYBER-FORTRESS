import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SystemModule } from './system/system.module';
import { ModulesModule } from './modules/modules.module';
import { SocModule } from './soc/soc.module';
import { PhishingShieldModule } from './modules-services/phishing-shield/phishing-shield.module';
import { VaultGuardianModule } from './modules-services/vault-guardian/vault-guardian.module';
import { EndpointGuardianModule } from './modules-services/endpoint-guardian/endpoint-guardian.module';
import { WebshieldModule } from './modules-services/webshield/webshield.module';
import { DigitalForensicsModule } from './modules-services/digital-forensics/digital-forensics.module';
import { ThreatIntelligenceModule } from './modules-services/threat-intelligence/threat-intelligence.module';
import { CloudBackupModule } from './modules-services/cloud-backup/cloud-backup.module';
import { IdentityGuardianModule } from './modules-services/identity-guardian/identity-guardian.module';
import { NetworkSentinelModule } from './modules-services/network-sentinel/network-sentinel.module';
import { RansomwareGuardianModule } from './modules-services/ransomware-guardian/ransomware-guardian.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    SystemModule,
    ModulesModule,
    SocModule,
    PhishingShieldModule,
    VaultGuardianModule,
    EndpointGuardianModule,
    WebshieldModule,
    DigitalForensicsModule,
    ThreatIntelligenceModule,
    CloudBackupModule,
    IdentityGuardianModule,
    NetworkSentinelModule,
    RansomwareGuardianModule,
    AuditModule,
    NotificationsModule,
    ReportsModule,
  ],
})
export class AppModule {}
