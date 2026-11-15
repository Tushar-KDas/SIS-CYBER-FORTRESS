# SIS CYBER FORTRESS — DATABASE ARCHITECTURE & PRISMA SCHEMA SPECIFICATION
**Engine:** PostgreSQL  
**ORM:** Prisma ORM  
**Primary Key Standard:** UUID v4  
**Audit Strategy:** Append-Only Immutable Records  

---

## 1. Domain Model Groupings

The database schema is organized into 6 coherent relational domains:
1. **Identity, Auth & RBAC Domain:** Users, Roles, Permissions, UserRoles, RolePermissions, ModuleAssignments, Sessions, MFAFactors, LoginEvents.
2. **Device & Asset Registry Domain:** Devices, DeviceSnapshots, DeviceApplications, NetworkSnapshots, Assets, AssetVerifications.
3. **Core Security Modules Domain:**
   - Identity Alerts (Module 01)
   - Phishing Scans & Threat Reports (Module 02)
   - Endpoint Events & Alerts (Module 03)
   - Network Events & Alerts (Module 04)
   - Vault Items (E2EE Client Payloads) (Module 05)
   - Backup Checks & File Changes (Module 06)
   - WebScans & Findings (Module 07)
   - Forensic Cases, Evidence Records & Custody Events (Module 08)
   - Threat Indicators (IOCs), Sources & Feed Syncs (Module 10)
   - Backup Jobs, Backup Objects & Restore Jobs (Module 11)
4. **Security Operations Center (SOC) Domain:** SecurityAlerts, Incidents, IncidentAssignments, IncidentEvents, IncidentNotes.
5. **System Governance & Shared Domain:** AuditLogs, Notifications, SystemSettings, ApiHealthChecks, IntegrationStatuses.

---

## 2. Table Indexing & Referential Constraints

- **Foreign Keys:** Enforced referential integrity across all relationships with `onDelete: Cascade` or `onDelete: Restrict` where data preservation is required (e.g., Audit logs and Forensic custody are preserved with `Restrict` or `SetNull` on user deletion).
- **Unique Constraints:**
  - `User.email`
  - `Role.name`
  - `Permission.key`
  - `Session.token`
  - `Asset.domain`
  - `ForensicCase.caseNumber`
  - `ThreatIndicator.type` + `ThreatIndicator.value`
- **Performance Indexes:**
  - `User(email, status)`
  - `Session(token, expiresAt)`
  - `SecurityAlert(status, severity, createdAt)`
  - `Incident(status, priority, createdAt)`
  - `AuditLog(actorUserId, action, resourceType, timestamp)`
  - `ThreatIndicator(type, value, severity)`
  - `ForensicCase(status, caseNumber)`
  - `WebScan(assetId, createdAt)`

---

## 3. Sensitive Data Sanitization & Cryptographic Invariants

1. **Passwords:** Stored ONLY as Argon2id hashes with salt embedded in the PHC format. Plaintext passwords never hit the database.
2. **MFA Secrets:** Stored with application-level encryption key or secure salt.
3. **Vault Items:**
   - Server stores: `ciphertext`, `iv`, `salt`, `authTag`, `title` (optional or encrypted), and category.
   - Server NEVER receives or stores plaintext passwords, plaintext private notes, or master encryption keys.
4. **Audit Logs:** Never record passwords, reset tokens, full request bodies containing credentials, or decrypted forensic artifacts.
5. **Digital Forensics Evidence:** Files stored in isolated storage; database stores only SHA-256 hash, file size, MIME type, uploader, and storage reference.
