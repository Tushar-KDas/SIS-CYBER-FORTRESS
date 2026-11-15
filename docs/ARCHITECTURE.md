# SIS CYBER FORTRESS — SYSTEM ARCHITECTURE SPECIFICATION
**Architecture Style:** Modular Monolith with Shared Core Services  
**Ecosystem Scope:** 12 Functional Security Modules + Central SOC + Multi-Tier RBAC  

---

## 1. High-Level Architectural Diagram

```text
                               +--------------------------------------------------------+
                               |                  SIS CYBER FORTRESS                    |
                               |          Unified Enterprise Cyber Platform             |
                               +--------------------------------------------------------+
                                                           |
                      +------------------------------------+------------------------------------+
                      |                                                                         |
                      v                                                                         v
      +-------------------------------+                                         +-------------------------------+
      |         PUBLIC PORTAL         |                                         |       SECURE CLIENT APPS      |
      |   - Enterprise Cyber Landing  |                                         |   - User Security Console     |
      |   - 12 Modules Catalog        |                                         |   - Super Admin Panel         |
      |   - Module Detail Showcase    |                                         |   - Security Admin SOC Desk   |
      |   - Public Documentation      |                                         |   - Module Admin Workspaces   |
      |   - About / Contact Portal    |                                         |   - Compliance Auditor Portal |
      +-------------------------------+                                         +-------------------------------+
                      \                                                                         /
                       \-----------------------------------+-----------------------------------/
                                                           |
                                                           v
                                        +-------------------------------------+
                                        |          NEXT.JS WEB APP            |
                                        |    App Router, Server Actions,      |
                                        |    Tailwind, Recharts, Lucide Icons |
                                        +-------------------------------------+
                                                           |
                                              HTTPS / JSON REST API (v1)
                                                           |
                                                           v
+--------------------------------------------------------------------------------------------------------------------+
|                                                NESTJS REST API (apps/api)                                          |
|                                                                                                                    |
|   +------------------------------------------------------------------------------------------------------------+   |
|   |                                          CORE CROSS-CUTTING SERVICES                                       |   |
|   |   - Auth & Session Service (Argon2id, TOTP MFA, Cookie Session Guard)                                      |   |
|   |   - RBAC Enforcement Engine (RoleGuard, PermissionsGuard, ModuleGuard)                                     |   |
|   |   - Centralized SOC & Alert Aggregator (Normalizer, Severity Engine, Deduplication)                       |   |
|   |   - Centralized Incident Management State Machine (New -> Triaged -> Investigating -> Contained -> Closed) |   |
|   |   - Immutable Audit Logger (Append-Only Event Stream, Security Redaction)                                  |   |
|   |   - Notification Dispatcher (In-App Event Broker, FCM Integration Adapter)                                 |   |
|   |   - System Health Diagnostics Engine (API, Database, Storage, Feeds)                                       |   |
|   +------------------------------------------------------------------------------------------------------------+   |
|                                                                                                                    |
|   +------------------------------------------------------------------------------------------------------------+   |
|   |                                       12 INDEPENDENT SECURITY MODULES                                      |   |
|   |   [01] Identity Guardian       [02] Phishing Shield       [03] Endpoint Guardian      [04] Network Sentinel     |   |
|   |   [05] Vault Guardian (E2EE)   [06] Ransomware Guardian   [07] WebShield (SSRF Safe)  [08] Digital Forensics    |   |
|   |   [09] Access Guardian         [10] Threat Intelligence   [11] Cloud Backup Guardian  [12] Cyber SOC Desk       |   |
|   +------------------------------------------------------------------------------------------------------------+   |
+--------------------------------------------------------------------------------------------------------------------+
                                                           |
                                                   Prisma ORM Client
                                                           |
                                                           v
+--------------------------------------------------------------------------------------------------------------------+
|                                                POSTGRESQL DATABASE                                                 |
|                                                                                                                    |
|  - Users & Security Credentials            - Enrolled Devices & Snapshots             - Central Alerts & Incidents |
|  - Roles, Permissions & Assignments        - WebShield Verified Assets & Scans        - Immutable Audit Events     |
|  - Zero-Knowledge Vault Objects (AES-GCM)   - Forensic Cases & Chain of Custody        - Threat Intelligence IOCs   |
|  - Encrypted Backup Jobs & Restorations    - Network Snapshots & Checklists           - In-App Notifications       |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Structural Isolation & Module Boundaries

Each cybersecurity module within `apps/api/src/modules/` adheres to strict boundary controls:
1. **Dedicated Module Service & Controller:** Each module owns its REST endpoints, DTO contracts, validation schemas, and database interaction layer.
2. **Standardized Alert Dispatch:** When any module detects an anomaly, security failure, or malicious signal, it emits a standardized `SecurityAlertPayload` through the internal `AlertAggregatorService`.
3. **No Direct Inter-Module Mutation:** Modules communicate through public interfaces and shared domain services rather than directly querying or modifying internal state of another module.
4. **Independent RBAC Scoping:** Module permissions are isolated (e.g., `webshield.scan`, `vault.create`, `forensics.evidence.upload`). A `MODULE_ADMIN` assigned to Module 02 (Phishing Shield) cannot read or configure Module 08 (Digital Forensics).

---

## 3. Cryptographic & Application Security Architecture

### 3.1 Authentication & Session Security
- **Password Storage:** Argon2id with recommended OWASP memory cost (64MB), iterations (3), and parallelism (4).
- **Session Tokens:** High-entropy random tokens stored in database with expiration, device fingerprint, and IP binding.
- **Cookies:** `HttpOnly`, `SameSite=Lax` (or `Strict` for mutations), `Secure` flags. No tokens stored in browser `localStorage`.
- **Multi-Factor Authentication:** RFC 6238 TOTP using 256-bit base32 secrets with 30-second time steps and replay prevention window.

### 3.2 Vault Guardian (Zero-Knowledge Architecture)
- **Client-Side Key Derivation:** Master passphrase derived on client using Argon2id with unique salt.
- **Encryption:** AES-256-GCM authenticated encryption. Unique 96-bit IV generated per item.
- **Zero-Knowledge Backend:** The server only accepts and persists ciphertext, salt, IV, and auth tag. Plaintext passphrases, notes, and keys are NEVER transmitted to or stored on the backend.

### 3.3 SSRF & Outbound Request Mitigation (WebShield & Phishing Shield)
- Strict DNS pre-resolution verification.
- Rejection of private IPv4 (RFC 1918), loopback (`127.0.0.0/8`), link-local (`169.254.0.0/16`), multicast, and IPv6 private equivalents.
- HTTP redirect revalidation preventing rebinding attacks.
- Configurable connection timeouts (max 5s) and response size limits (max 1MB).

### 3.4 Forensic Custody Immutability
- SHA-256 cryptographic hashing performed upon evidence upload.
- Chain-of-custody records are append-only. Modification or deletion of historical custody transfers is blocked by both application guards and database rules.
