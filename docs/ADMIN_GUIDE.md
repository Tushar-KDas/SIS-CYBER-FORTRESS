# SIS CYBER FORTRESS — ADMINISTRATOR OPERATIONAL GUIDE
**Target Roles:** Super Admin, Security Admin, Module Admin, Compliance Auditor  

---

## 1. Role-Based Navigation & Access Tiers

| Role | Dedicated Route | Core Purpose |
|---|---|---|
| **SUPER_ADMIN** | `/admin/super-admin` | Platform governance, user & role management, system health, all 12 modules. |
| **SECURITY_ADMIN**| `/admin/security-admin` | Central SOC desk, alert queue, incident investigation, threat intelligence. |
| **MODULE_ADMIN** | `/admin/module-admin` | Delegated administration for assigned modules only. |
| **AUDITOR** | `/admin/auditor` | Read-only access to audit logs, custody trails, and system reports. |

---

## 2. Super Admin Workflows (`/admin/super-admin`)

1. **User Management:**
   - View all registered accounts, status (`ACTIVE`, `SUSPENDED`), and active sessions.
   - Modify user roles and suspend compromised accounts.
2. **Role & Permission Management:**
   - Define custom roles and granular permission sets.
   - Manage module assignments for `MODULE_ADMIN` users.
3. **Module Operational Status:**
   - Inspect status across all 12 modules (`Active`, `Maintenance`, `Error`, `Not Configured`).
   - Configure global module parameters.
4. **Asset Registry:**
   - Approve enterprise domains and trigger ownership challenge verification.
5. **System Health & Integrations:**
   - Monitor real-time status of Database, API, Storage, and external threat feeds.

---

## 3. Security Admin & SOC Workflows (`/admin/security-admin`)

1. **Unified Alert Queue:**
   - Triage incoming alerts aggregated from all 12 security modules.
   - Filter by severity: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFORMATIONAL`.
2. **Incident Lifecycle Management:**
   - Escalate severe alerts into formal Incidents.
   - Assign incidents to security analysts.
   - Execute the strict state machine workflow: `NEW` -> `TRIAGED` -> `INVESTIGATING` -> `CONTAINMENT` -> `RESOLVED` -> `CLOSED`.
   - Add investigation notes and forensic evidence references.
3. **Threat Intelligence Feed Management:**
   - Curate Indicators of Compromise (IOCs): Malicious IPs, domains, URLs, and file hashes.
   - Sync external threat feeds and inspect confidence ratings.

---

## 4. Module Admin Workflows (`/admin/module-admin`)

- Module Admins can only view and manage modules explicitly assigned to their user account in the database.
- Access to unassigned modules is blocked at the API level (HTTP 403 Forbidden).

---

## 5. Auditor Workflows (`/admin/auditor`)

- **Strict Read-Only Enforcement:** Auditor accounts cannot create users, assign roles, edit incidents, or modify system configurations.
- **Audit Log Inspection:** Filter by actor, action, timestamp, and outcome (`SUCCESS`, `FAILURE`, `DENIED`).
- **Forensic Chain-of-Custody:** Verify SHA-256 evidence hashes and review immutable transfer logs.
