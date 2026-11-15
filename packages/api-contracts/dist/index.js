"use strict";
// ==========================================
// SIS CYBER FORTRESS — SHARED API CONTRACTS
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthState = exports.ThreatIndicatorType = exports.ForensicCaseStatus = exports.VaultItemCategory = exports.DeviceStatus = exports.DevicePlatform = exports.IncidentPriority = exports.IncidentStatus = exports.AlertStatus = exports.AlertSeverity = exports.ModuleStatus = exports.ModuleKey = exports.PERMISSIONS = exports.UserStatus = exports.UserRole = void 0;
// --- Roles & Permissions ---
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["SECURITY_ADMIN"] = "SECURITY_ADMIN";
    UserRole["MODULE_ADMIN"] = "MODULE_ADMIN";
    UserRole["AUDITOR"] = "AUDITOR";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["DEACTIVATED"] = "DEACTIVATED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
exports.PERMISSIONS = {
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
};
// --- 12 Cybersecurity Modules ---
var ModuleKey;
(function (ModuleKey) {
    ModuleKey["IDENTITY_GUARDIAN"] = "identity-guardian";
    ModuleKey["PHISHING_SHIELD"] = "phishing-shield";
    ModuleKey["ENDPOINT_GUARDIAN"] = "endpoint-guardian";
    ModuleKey["NETWORK_SENTINEL"] = "network-sentinel";
    ModuleKey["VAULT_GUARDIAN"] = "vault-guardian";
    ModuleKey["RANSOMWARE_GUARDIAN"] = "ransomware-guardian";
    ModuleKey["WEBSHIELD"] = "webshield";
    ModuleKey["DIGITAL_FORENSICS"] = "digital-forensics";
    ModuleKey["ACCESS_GUARDIAN"] = "access-guardian";
    ModuleKey["THREAT_INTELLIGENCE"] = "threat-intelligence";
    ModuleKey["CLOUD_BACKUP"] = "cloud-backup";
    ModuleKey["CYBER_SOC"] = "cyber-soc";
})(ModuleKey || (exports.ModuleKey = ModuleKey = {}));
var ModuleStatus;
(function (ModuleStatus) {
    ModuleStatus["ACTIVE"] = "Active";
    ModuleStatus["INACTIVE"] = "Inactive";
    ModuleStatus["MAINTENANCE"] = "Maintenance";
    ModuleStatus["ERROR"] = "Error";
    ModuleStatus["NOT_CONFIGURED"] = "Not Configured";
    ModuleStatus["AWAITING_DEVICE_SYNC"] = "Awaiting Device Sync";
    ModuleStatus["EXTERNAL_INTEGRATION_REQUIRED"] = "External Integration Required";
    ModuleStatus["NOT_IMPLEMENTED"] = "Not Implemented";
})(ModuleStatus || (exports.ModuleStatus = ModuleStatus = {}));
// --- Alerts & SOC ---
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFORMATIONAL"] = "INFORMATIONAL";
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["UNRESOLVED"] = "UNRESOLVED";
    AlertStatus["INVESTIGATING"] = "INVESTIGATING";
    AlertStatus["RESOLVED"] = "RESOLVED";
    AlertStatus["FALSE_POSITIVE"] = "FALSE_POSITIVE";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["NEW"] = "NEW";
    IncidentStatus["TRIAGED"] = "TRIAGED";
    IncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    IncidentStatus["CONTAINMENT"] = "CONTAINMENT";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
var IncidentPriority;
(function (IncidentPriority) {
    IncidentPriority["LOW"] = "LOW";
    IncidentPriority["MEDIUM"] = "MEDIUM";
    IncidentPriority["HIGH"] = "HIGH";
    IncidentPriority["CRITICAL"] = "CRITICAL";
})(IncidentPriority || (exports.IncidentPriority = IncidentPriority = {}));
// --- Devices ---
var DevicePlatform;
(function (DevicePlatform) {
    DevicePlatform["WINDOWS"] = "WINDOWS";
    DevicePlatform["MACOS"] = "MACOS";
    DevicePlatform["LINUX"] = "LINUX";
    DevicePlatform["ANDROID"] = "ANDROID";
    DevicePlatform["IOS"] = "IOS";
    DevicePlatform["UNKNOWN"] = "UNKNOWN";
})(DevicePlatform || (exports.DevicePlatform = DevicePlatform = {}));
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus["ACTIVE"] = "ACTIVE";
    DeviceStatus["OFFLINE"] = "OFFLINE";
    DeviceStatus["COMPROMISED"] = "COMPROMISED";
    DeviceStatus["AWAITING_SYNC"] = "AWAITING_SYNC";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
// --- Vault Items (Zero Knowledge) ---
var VaultItemCategory;
(function (VaultItemCategory) {
    VaultItemCategory["PASSWORD"] = "PASSWORD";
    VaultItemCategory["SECURE_NOTE"] = "SECURE_NOTE";
    VaultItemCategory["CREDENTIAL"] = "CREDENTIAL";
    VaultItemCategory["RECOVERY_KEY"] = "RECOVERY_KEY";
})(VaultItemCategory || (exports.VaultItemCategory = VaultItemCategory = {}));
// --- Digital Forensics ---
var ForensicCaseStatus;
(function (ForensicCaseStatus) {
    ForensicCaseStatus["OPEN"] = "OPEN";
    ForensicCaseStatus["ACTIVE"] = "ACTIVE";
    ForensicCaseStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    ForensicCaseStatus["CLOSED"] = "CLOSED";
})(ForensicCaseStatus || (exports.ForensicCaseStatus = ForensicCaseStatus = {}));
// --- Threat Intelligence ---
var ThreatIndicatorType;
(function (ThreatIndicatorType) {
    ThreatIndicatorType["IP"] = "IP";
    ThreatIndicatorType["DOMAIN"] = "DOMAIN";
    ThreatIndicatorType["URL"] = "URL";
    ThreatIndicatorType["FILE_HASH_SHA256"] = "FILE_HASH_SHA256";
    ThreatIndicatorType["FILE_HASH_MD5"] = "FILE_HASH_MD5";
})(ThreatIndicatorType || (exports.ThreatIndicatorType = ThreatIndicatorType = {}));
// --- System Diagnostics ---
var ServiceHealthState;
(function (ServiceHealthState) {
    ServiceHealthState["HEALTHY"] = "Healthy";
    ServiceHealthState["DEGRADED"] = "Degraded";
    ServiceHealthState["UNAVAILABLE"] = "Unavailable";
    ServiceHealthState["NOT_CONFIGURED"] = "Not Configured";
})(ServiceHealthState || (exports.ServiceHealthState = ServiceHealthState = {}));
//# sourceMappingURL=index.js.map