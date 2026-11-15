// ==========================================
// SIS CYBER FORTRESS — SHARED API CONTRACTS
// ==========================================

// --- Roles & Permissions ---
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  MODULE_ADMIN = 'MODULE_ADMIN',
  AUDITOR = 'AUDITOR',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export const PERMISSIONS = {
  // Users
  USERS_READ: 'users.read',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_SUSPEND: 'users.suspend',

  // Roles & RBAC
  ROLES_READ: 'roles.read',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_ASSIGN: 'roles.assign',

  // Modules
  MODULES_READ: 'modules.read',
  MODULES_MANAGE: 'modules.manage',
  MODULES_CONFIGURE: 'modules.configure',

  // Devices
  DEVICES_READ: 'devices.read',
  DEVICES_REGISTER: 'devices.register',
  DEVICES_UPDATE: 'devices.update',

  // Alerts & SOC
  ALERTS_READ: 'alerts.read',
  ALERTS_MANAGE: 'alerts.manage',
  INCIDENTS_READ: 'incidents.read',
  INCIDENTS_CREATE: 'incidents.create',
  INCIDENTS_ASSIGN: 'incidents.assign',
  INCIDENTS_UPDATE: 'incidents.update',
  INCIDENTS_CLOSE: 'incidents.close',

  // Forensics
  FORENSICS_READ: 'forensics.read',
  FORENSICS_CREATE: 'forensics.create',
  FORENSICS_EVIDENCE_UPLOAD: 'forensics.evidence.upload',
  FORENSICS_CUSTODY_TRANSFER: 'forensics.custody.transfer',

  // Threat Intel
  THREAT_INTEL_READ: 'threat_intel.read',
  THREAT_INTEL_MANAGE: 'threat_intel.manage',

  // Audit & Reports
  AUDIT_READ: 'audit.read',
  REPORTS_READ: 'reports.read',
  REPORTS_EXPORT: 'reports.export',

  // Settings & System
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',
  SYSTEM_HEALTH_READ: 'system.health.read',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// --- 12 Cybersecurity Modules ---
export enum ModuleKey {
  IDENTITY_GUARDIAN = 'identity-guardian',
  PHISHING_SHIELD = 'phishing-shield',
  ENDPOINT_GUARDIAN = 'endpoint-guardian',
  NETWORK_SENTINEL = 'network-sentinel',
  VAULT_GUARDIAN = 'vault-guardian',
  RANSOMWARE_GUARDIAN = 'ransomware-guardian',
  WEBSHIELD = 'webshield',
  DIGITAL_FORENSICS = 'digital-forensics',
  ACCESS_GUARDIAN = 'access-guardian',
  THREAT_INTELLIGENCE = 'threat-intelligence',
  CLOUD_BACKUP = 'cloud-backup',
  CYBER_SOC = 'cyber-soc',
}

export enum ModuleStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance',
  ERROR = 'Error',
  NOT_CONFIGURED = 'Not Configured',
  AWAITING_DEVICE_SYNC = 'Awaiting Device Sync',
  EXTERNAL_INTEGRATION_REQUIRED = 'External Integration Required',
  NOT_IMPLEMENTED = 'Not Implemented',
}

export interface SecurityModuleMetadata {
  id: string;
  key: ModuleKey;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: 'Identity' | 'Endpoint' | 'Network' | 'Data Protection' | 'Threat Defense' | 'Operations';
  status: ModuleStatus;
  version: string;
  capabilities: string[];
}

// --- Alerts & SOC ---
export enum AlertSeverity {
  INFORMATIONAL = 'INFORMATIONAL',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  UNRESOLVED = 'UNRESOLVED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export enum IncidentStatus {
  NEW = 'NEW',
  TRIAGED = 'TRIAGED',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINMENT = 'CONTAINMENT',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum IncidentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface SecurityAlertDto {
  id: string;
  title: string;
  description: string;
  moduleKey: ModuleKey;
  severity: AlertSeverity;
  status: AlertStatus;
  sourceIp?: string;
  targetResource?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentDto {
  id: string;
  incidentNumber: string;
  title: string;
  summary: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  assignedToUserId?: string;
  assignedToName?: string;
  relatedAlertIds: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

// --- Devices ---
export enum DevicePlatform {
  WINDOWS = 'WINDOWS',
  MACOS = 'MACOS',
  LINUX = 'LINUX',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  UNKNOWN = 'UNKNOWN',
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  OFFLINE = 'OFFLINE',
  COMPROMISED = 'COMPROMISED',
  AWAITING_SYNC = 'AWAITING_SYNC',
}

export interface DeviceDto {
  id: string;
  userId: string;
  name: string;
  platform: DevicePlatform;
  osVersion: string;
  ipAddress?: string;
  macAddress?: string;
  status: DeviceStatus;
  securityScore: number;
  lastSeenAt: string;
  createdAt: string;
}

// --- Vault Items (Zero Knowledge) ---
export enum VaultItemCategory {
  PASSWORD = 'PASSWORD',
  SECURE_NOTE = 'SECURE_NOTE',
  CREDENTIAL = 'CREDENTIAL',
  RECOVERY_KEY = 'RECOVERY_KEY',
}

export interface VaultItemDto {
  id: string;
  userId: string;
  title: string;
  category: VaultItemCategory;
  ciphertext: string;
  iv: string;
  salt: string;
  authTag: string;
  createdAt: string;
  updatedAt: string;
}

// --- Digital Forensics ---
export enum ForensicCaseStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  PENDING_REVIEW = 'PENDING_REVIEW',
  CLOSED = 'CLOSED',
}

export interface ForensicCaseDto {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: ForensicCaseStatus;
  leadInvestigatorId?: string;
  leadInvestigatorName?: string;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRecordDto {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  fileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
  mimeType: string;
  storageRef: string;
  uploadedByUserId: string;
  uploadedByName: string;
  createdAt: string;
}

// --- Threat Intelligence ---
export enum ThreatIndicatorType {
  IP = 'IP',
  DOMAIN = 'DOMAIN',
  URL = 'URL',
  FILE_HASH_SHA256 = 'FILE_HASH_SHA256',
  FILE_HASH_MD5 = 'FILE_HASH_MD5',
}

export interface ThreatIndicatorDto {
  id: string;
  type: ThreatIndicatorType;
  value: string;
  severity: AlertSeverity;
  confidenceScore: number;
  source: string;
  tags: string[];
  description?: string;
  createdAt: string;
}

// --- Audit Log ---
export interface AuditLogDto {
  id: string;
  actorUserId?: string;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// --- System Diagnostics ---
export enum ServiceHealthState {
  HEALTHY = 'Healthy',
  DEGRADED = 'Degraded',
  UNAVAILABLE = 'Unavailable',
  NOT_CONFIGURED = 'Not Configured',
}

export interface SystemHealthResponse {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  services: {
    backendApi: ServiceHealthState;
    database: ServiceHealthState;
    redisCache: ServiceHealthState;
    fileStorage: ServiceHealthState;
    notificationsFcm: ServiceHealthState;
    externalFeeds: ServiceHealthState;
  };
}
