import { PrismaClient } from '@prisma/client';
import { ModuleKey, PERMISSIONS } from '@sis/api-contracts';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting database initialization...');

  // 1. Seed Roles
  const roles = [
    {
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Full authorized platform administration, governance, and user management.',
      isSystem: true,
    },
    {
      name: 'SECURITY_ADMIN',
      displayName: 'Security Administrator',
      description: 'Security operations center (SOC) lead, incident investigation, and threat intelligence curation.',
      isSystem: true,
    },
    {
      name: 'MODULE_ADMIN',
      displayName: 'Module Administrator',
      description: 'Targeted administration restricted to explicitly assigned security modules.',
      isSystem: true,
    },
    {
      name: 'AUDITOR',
      displayName: 'Compliance Auditor',
      description: 'Strictly read-only access to audit trails, forensic metadata, and compliance evidence.',
      isSystem: true,
    },
    {
      name: 'USER',
      displayName: 'Standard User',
      description: 'Standard end-user security console, device enrollment, and zero-knowledge vault.',
      isSystem: true,
    },
  ];

  const roleRecords: Record<string, any> = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: r,
      create: r,
    });
    roleRecords[r.name] = role;
    console.log(`[SEED] Upserted Role: ${r.name}`);
  }

  // 2. Seed Permissions
  const permissionEntries = Object.entries(PERMISSIONS);
  const permissionRecords: Record<string, any> = {};

  for (const [keyName, permValue] of permissionEntries) {
    const perm = await prisma.permission.upsert({
      where: { key: permValue },
      update: { name: keyName, description: `Permission for ${permValue}` },
      create: { key: permValue, name: keyName, description: `Permission for ${permValue}` },
    });
    permissionRecords[permValue] = perm;
  }
  console.log(`[SEED] Upserted ${permissionEntries.length} Permissions.`);

  // 3. Assign Permissions to Roles
  // Super Admin gets all permissions
  for (const perm of Object.values(permissionRecords)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleRecords['SUPER_ADMIN'].id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roleRecords['SUPER_ADMIN'].id,
        permissionId: perm.id,
      },
    });
  }

  // Auditor gets read-only permissions
  const auditorPermKeys = [
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.ALERTS_READ,
    PERMISSIONS.INCIDENTS_READ,
    PERMISSIONS.FORENSICS_READ,
    PERMISSIONS.THREAT_INTEL_READ,
    PERMISSIONS.SYSTEM_HEALTH_READ,
  ];
  for (const permKey of auditorPermKeys) {
    if (permissionRecords[permKey]) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecords['AUDITOR'].id,
            permissionId: permissionRecords[permKey].id,
          },
        },
        update: {},
        create: {
          roleId: roleRecords['AUDITOR'].id,
          permissionId: permissionRecords[permKey].id,
        },
      });
    }
  }

  // 4. Seed the 12 Cybersecurity Modules
  const modules = [
    {
      key: ModuleKey.IDENTITY_GUARDIAN,
      name: 'SIS Identity Guardian',
      tagline: 'Digital Identity & Account Protection',
      description: 'Guards digital identity, monitors authentication activity, flags suspicious logins, and tracks password hygiene with explainable security scores.',
      icon: 'UserCheck',
      category: 'Identity',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Login Activity Auditing',
        'Suspicious Access Detection',
        'Multi-Factor Authentication Enforcer',
        'Explainable Account Security Score',
        'Compromised Credential Breach Monitor',
      ]),
    },
    {
      key: ModuleKey.PHISHING_SHIELD,
      name: 'SIS Phishing Shield',
      tagline: 'Phishing, Scam & Malicious URL Awareness',
      description: 'SSRF-protected URL and domain scanner detecting credential harvesting, deceptive redirects, and zero-day scam sites.',
      icon: 'ShieldAlert',
      category: 'Threat Defense',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'SSRF-Safe URL Inspection',
        'Domain Reputation Analysis',
        'Heuristic Risk Scoring',
        'Threat Categorization',
        'User Threat Report Intake',
      ]),
    },
    {
      key: ModuleKey.ENDPOINT_GUARDIAN,
      name: 'SIS Endpoint Guardian',
      tagline: 'Device Security Posture & Inventory',
      description: 'Manages enterprise and personal hardware inventory, tracks OS patch levels, firewall status, and prepares endpoints for mobile sync.',
      icon: 'Laptop',
      category: 'Endpoint',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Device Inventory Management',
        'OS Version & Patch Verification',
        'Disk Encryption & Firewall Telemetry',
        'Device Security Posture Scoring',
        'Android Sync Protocol Ready',
      ]),
    },
    {
      key: ModuleKey.NETWORK_SENTINEL,
      name: 'SIS Network Sentinel',
      tagline: 'Network Security Awareness & Wi-Fi Auditing',
      description: 'Monitors wireless protocol security, detects captive portals and unencrypted networks, and provides structured security checklists.',
      icon: 'Wifi',
      category: 'Network',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Wi-Fi Encryption Auditing (WPA2/WPA3)',
        'Rogue Hotspot & Public Wi-Fi Warnings',
        'Network Snapshot Logging',
        'Interactive Network Hardening Checklist',
      ]),
    },
    {
      key: ModuleKey.VAULT_GUARDIAN,
      name: 'SIS Vault Guardian',
      tagline: 'Zero-Knowledge Encrypted Password & Note Vault',
      description: 'Client-side AES-256-GCM authenticated encryption. Passwords and notes are encrypted before transmission; server stores only zero-knowledge ciphertexts.',
      icon: 'Lock',
      category: 'Data Protection',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Client-Side AES-256-GCM Encryption',
        'Zero-Knowledge Server Storage',
        'Secure Notes & Credentials',
        'Cryptographic Recovery Workflow',
        'Tamper-Evident Authentication Tags',
      ]),
    },
    {
      key: ModuleKey.RANSOMWARE_GUARDIAN,
      name: 'SIS Ransomware Guardian',
      tagline: 'Ransomware Risk Awareness & Data Recovery Readiness',
      description: 'Evaluates enterprise backup resilience, verifies file integrity hashes for authorized data sets, and ensures rapid disaster recovery readiness.',
      icon: 'ShieldOff',
      category: 'Threat Defense',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Backup Readiness Auditing',
        'Cryptographic File Integrity Verification',
        'Safe File Change Event Tracking',
        'Disaster Recovery Checklist',
      ]),
    },
    {
      key: ModuleKey.WEBSHIELD,
      name: 'SIS WebShield',
      tagline: 'Authorized Website Security Scanning',
      description: 'SSRF-hardened active and passive scanner checking TLS/SSL certificates, HTTP security headers, and domain ownership challenges.',
      icon: 'Globe',
      category: 'Threat Defense',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Authorized Asset Ownership Verification',
        'SSL/TLS Certificate Validity & Expiry Checks',
        'HTTP Security Header Audit (HSTS, CSP, XFO)',
        'SSRF-Hardened Pre-Resolution Engine',
        'Automated Findings & Remediation Advice',
      ]),
    },
    {
      key: ModuleKey.DIGITAL_FORENSICS,
      name: 'SIS Digital Forensics',
      tagline: 'Evidence & Incident Case Management',
      description: 'Enterprise forensic case tracking, private SHA-256 evidence ingestion, and strictly append-only chain-of-custody logging.',
      icon: 'Search',
      category: 'Operations',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Forensic Case Lifecycle Tracking',
        'Cryptographic SHA-256 Evidence Hashing',
        'Append-Only Chain-of-Custody Records',
        'Custody Transfer & Access Auditing',
        'Case Report Generation',
      ]),
    },
    {
      key: ModuleKey.ACCESS_GUARDIAN,
      name: 'SIS Access Guardian',
      tagline: 'Centralized Authentication & Session Governance',
      description: 'Central console for active session tracking, multi-device revocation, login anomaly alerts, and enterprise access policies.',
      icon: 'Key',
      category: 'Identity',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Active Session Monitoring & Remote Revocation',
        'Device-Level Session Disconnection',
        'Login Anomaly Detection',
        'Access Policy Governance',
      ]),
    },
    {
      key: ModuleKey.THREAT_INTELLIGENCE,
      name: 'SIS Threat Intelligence',
      tagline: 'Cyber Threat Feed & Indicator Management',
      description: 'Centralized Indicators of Compromise (IOC) repository indexing malicious IPs, domains, URLs, and malware file hashes with confidence ratings.',
      icon: 'Crosshair',
      category: 'Threat Defense',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Multi-Type IOC Management (IP, Domain, URL, Hash)',
        'Threat Severity & Confidence Scoring',
        'External Threat Feed Synchronization',
        'Fast Threat Search & Deduplication',
      ]),
    },
    {
      key: ModuleKey.CLOUD_BACKUP,
      name: 'SIS Cloud Backup Guardian',
      tagline: 'Encrypted Backup & Recovery Management',
      description: 'Schedules automated encrypted backup archives, monitors storage quotas, and provides verifiable restoration workflows.',
      icon: 'Cloud',
      category: 'Data Protection',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Automated Backup Job Scheduling',
        'Encrypted Storage Management',
        'Cryptographic Hash Restoration Verification',
        'Retention Policy Governance',
      ]),
    },
    {
      key: ModuleKey.CYBER_SOC,
      name: 'SIS Cyber SOC',
      tagline: 'Centralized Security Operations Center',
      description: 'Unified command center aggregating alerts across all 12 modules, orchestrating formal incident triage, and tracking investigation timelines.',
      icon: 'Headphones',
      category: 'Operations',
      status: 'Active',
      version: '1.0.0',
      capabilities: JSON.stringify([
        'Unified Cross-Module Alert Aggregator',
        'Formal Incident Lifecycle (New to Closed)',
        'Analyst Investigation Notes & Timelines',
        'Incident Severity & Prioritization Matrix',
        'SOC Operational Analytics',
      ]),
    },
  ];

  for (const m of modules) {
    await prisma.securityModule.upsert({
      where: { key: m.key },
      update: m,
      create: m,
    });
    console.log(`[SEED] Upserted Security Module: ${m.name}`);
  }

  // 5. Seed Initial Real Security Alerts (Matching user reference mockup)
  const initialAlerts = [
    {
      title: 'Malicious URL Detected',
      description: 'Target URL identified in known credential harvesting phishing campaign: https://secure-login-account-update.xyz',
      moduleKey: ModuleKey.PHISHING_SHIELD,
      severity: 'CRITICAL',
      status: 'UNRESOLVED',
      sourceIp: '198.51.100.42',
      targetResource: 'https://secure-login-account-update.xyz',
    },
    {
      title: 'Suspicious Login Attempt',
      description: 'Failed login attempt with incorrect credentials from anomalous geographic location (Tor Exit Node).',
      moduleKey: ModuleKey.IDENTITY_GUARDIAN,
      severity: 'HIGH',
      status: 'UNRESOLVED',
      sourceIp: '185.220.101.5',
      targetResource: 'Authentication Gateway',
    },
    {
      title: 'New Device Registered',
      description: 'New workstation enrolled by user: "MacBook-Pro-Workstation" running macOS 14.4.',
      moduleKey: ModuleKey.ENDPOINT_GUARDIAN,
      severity: 'INFORMATIONAL',
      status: 'RESOLVED',
      sourceIp: '192.168.1.104',
      targetResource: 'MacBook-Pro-Workstation',
    },
    {
      title: 'Backup Completed',
      description: 'Daily encrypted application database snapshot completed successfully. Hash verified.',
      moduleKey: ModuleKey.CLOUD_BACKUP,
      severity: 'LOW',
      status: 'RESOLVED',
      sourceIp: '127.0.0.1',
      targetResource: 'sis_cyber_fortress_daily.enc',
    },
  ];

  for (const a of initialAlerts) {
    await prisma.securityAlert.create({
      data: a as any,
    });
  }
  console.log(`[SEED] Seeded ${initialAlerts.length} initial security alerts.`);

  // 6. Seed Initial Incident
  const existingIncident = await prisma.incident.findFirst({
    where: { incidentNumber: 'INC-2026-001' },
  });
  if (!existingIncident) {
    await prisma.incident.create({
      data: {
        incidentNumber: 'INC-2026-001',
        title: 'Active Phishing Campaign Targeting Enterprise Credentials',
        summary: 'Multiple phishing alerts detected originating from lookalike domain secure-login-account-update.xyz. Immediate DNS block and triage initiated.',
        status: 'INVESTIGATING',
        priority: 'CRITICAL',
      },
    });
    console.log('[SEED] Created Initial Incident: INC-2026-001');
  }

  // 7. Seed System Health Checks
  const healthServices = [
    { serviceName: 'Backend API', status: 'Healthy', responseTimeMs: 4, details: 'NestJS REST API running on port 4000' },
    { serviceName: 'Database (PostgreSQL)', status: 'Healthy', responseTimeMs: 2, details: 'PostgreSQL Relational DB with Prisma ORM' },
    { serviceName: 'Redis Cache', status: 'Healthy', responseTimeMs: 1, details: 'In-memory cache adapter connected' },
    { serviceName: 'File Storage', status: 'Healthy', responseTimeMs: 6, details: 'Private local secure storage driver initialized' },
    { serviceName: 'Notifications (FCM)', status: 'Configured', responseTimeMs: 0, details: 'In-app notification broker operational' },
    { serviceName: 'External Feeds', status: 'Healthy', responseTimeMs: 15, details: 'Threat Intelligence feed aggregator synchronized' },
  ];

  for (const h of healthServices) {
    await prisma.apiHealthCheck.create({
      data: h,
    });
  }
  console.log('[SEED] Seeded System Health diagnostics.');

  // 8. Seed Sample Threat Indicators
  const sampleIOCs = [
    {
      type: 'DOMAIN',
      value: 'secure-login-account-update.xyz',
      severity: 'CRITICAL',
      confidenceScore: 98,
      source: 'SIS Threat Intelligence Engine',
      tags: 'phishing,credential-harvesting,malicious',
      description: 'Actively reported phishing domain impersonating corporate authentication.',
    },
    {
      type: 'IP',
      value: '185.220.101.5',
      severity: 'HIGH',
      confidenceScore: 90,
      source: 'Threat Feeds Global',
      tags: 'tor-exit,brute-force,scanner',
      description: 'Known Tor exit node actively conducting credential stuffing.',
    },
    {
      type: 'FILE_HASH_SHA256',
      value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      severity: 'LOW',
      confidenceScore: 100,
      source: 'Internal Forensic Benchmark',
      tags: 'empty-file,benchmark,baseline',
      description: 'Empty payload SHA-256 baseline test hash.',
    },
  ];

  for (const ioc of sampleIOCs) {
    await prisma.threatIndicator.upsert({
      where: {
        type_value: {
          type: ioc.type,
          value: ioc.value,
        },
      },
      update: ioc,
      create: ioc,
    });
  }
  console.log('[SEED] Seeded Threat Intelligence indicators.');

  console.log('[SEED] Database initialization completed successfully.');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
