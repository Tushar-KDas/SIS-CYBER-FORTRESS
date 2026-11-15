# SIS CYBER FORTRESS — REQUIREMENTS SPECIFICATION
**Version:** 1.0.0-ENTERPRISE  
**Project Category:** 12-in-1 Enterprise Cybersecurity Ecosystem  
**Target Platform:** Web Platform (Next.js 14/15, NestJS REST API, PostgreSQL, Prisma ORM)  
**Future Scope:** Android Mobile Application (Jetpack Compose, Kotlin) sharing unified REST API  

---

## 1. Executive Summary & Objective

SIS CYBER FORTRESS is an enterprise-grade, centralized 12-in-1 cybersecurity web platform designed to protect digital identity, devices, web assets, networks, and confidential company data through real-time intelligence, proactive threat mitigation, cryptographic security, and centralized Security Operations Center (SOC) management.

The platform provides genuine, functional security capabilities across twelve independent modules, backed by a scalable NestJS REST API, PostgreSQL relational database via Prisma ORM, robust Role-Based Access Control (RBAC), and responsive Next.js frontend applications tailored for both end-users and specialized administrative roles.

---

## 2. Core Operational & Development Principles

1. **Zero Fake Implementation (Absolute Authenticity):**
   - No mock statistics, fake scan numbers, or arbitrary hardcoded counts.
   - All dashboard metrics (Users, Devices, Alerts, Incidents, Module Status) are derived dynamically from real PostgreSQL records.
   - Modules and external providers display genuine operational states: `Active`, `Inactive`, `Maintenance`, `Error`, `Not Configured`, `Awaiting Device Sync`, `External Integration Required`, or `Not Implemented`.
   - All forms save data; all action buttons trigger verified backend endpoints; all navigation links resolve to functional views.

2. **Modular Monolith Architecture:**
   - Single cohesive NestJS backend with explicit domain module boundaries.
   - Centralized authentication, RBAC, audit logging, and notification dispatchers.
   - Isolated security contexts: a compromise or fault in one module does not grant lateral privileges across other modules.

3. **Enterprise Defense-in-Depth:**
   - Argon2id password hashing with secure parameters.
   - Multi-Factor Authentication (MFA / TOTP) and Passkey readiness.
   - Cryptographically secure session management with HttpOnly, SameSite, Secure cookies.
   - Client-side end-to-end encryption (AES-256-GCM) for Vault Guardian with zero-knowledge server storage.
   - Strict SSRF defense with DNS resolution checks and private network blocking for WebShield and Phishing Shield.
   - Append-only digital forensics chain of custody with SHA-256 integrity verification.

---

## 3. System Scope & Functional Requirements

### 3.1 Public Portal (`apps/web/app/(public)`)
- **Homepage:** High-impact enterprise cybersecurity design featuring unified cyber defense branding, dynamic platform overview, live module capabilities, architecture preview, interactive security score demonstration, and operational call-to-actions.
- **Module Catalog:** Directory of all 12 modules with descriptions, functional status, and individual detail pages.
- **About & Contact:** Organization profile, mission, compliance alignment, and interactive contact form.
- **Authentication Routes:** Dedicated user registration, login, MFA verification, and password recovery workflows.

### 3.2 Authentication & Identity Management
- **Registration & Verification:** User sign-up with email validation, password strength verification, and automatic onboarding.
- **Multi-Factor Authentication (MFA):** RFC 6238 TOTP enrollment, QR code generation, secret verification, and emergency recovery codes.
- **Session Security:** Track active sessions (IP address, user agent, last active time, device type), individual session revocation, and global logout.
- **First Super Admin Bootstrap:** CLI/Environment-based bootstrap mechanism that creates the initial Super Admin account without exposing public endpoints or default credentials.

### 3.3 Role-Based Access Control (RBAC)
Five strictly enforced authorization tiers:
1. `SUPER_ADMIN`: Complete platform governance, system configuration, user/role management, security asset oversight, and API monitoring.
2. `SECURITY_ADMIN`: Security Operations Center (SOC) management, alert triage, incident lifecycle management, and threat intelligence curation.
3. `MODULE_ADMIN`: Targeted administrative access restricted explicitly to assigned cybersecurity modules and their settings.
4. `AUDITOR`: Strictly read-only access to immutable audit logs, incident histories, custody trails, and system reports.
5. `USER`: Personal dashboard, enrolled device monitoring, personal vault items, threat report submissions, and self-security posture.

### 3.4 Twelve Cybersecurity Modules

| # | Module Name | Purpose & Primary Capabilities |
|---|---|---|
| **01** | **SIS Identity Guardian** | Digital identity protection, login activity audit, credential compromise detection, and dynamic security scoring based on real account signals. |
| **02** | **SIS Phishing Shield** | Safe URL & domain reputation analysis, threat categorization, heuristic risk scoring, and malicious link reporting. |
| **03** | **SIS Endpoint Guardian** | Device registration, hardware/OS inventory, posture assessment, and preparation for Android sync. |
| **04** | **SIS Network Sentinel** | Network snapshot audits, Wi-Fi configuration inspection, rogue connection alerts, and security checklists. |
| **05** | **SIS Vault Guardian** | Zero-knowledge client-side AES-256-GCM encrypted password and secure note vault with cryptographic recovery. |
| **06** | **SIS Ransomware Guardian** | Data backup readiness auditing, safe file integrity monitoring, and rapid recovery checklists. |
| **07** | **SIS WebShield** | Authorized web asset registration, ownership challenge verification, SSL/TLS checks, and HTTP security header auditing. |
| **08** | **SIS Digital Forensics** | Incident case management, evidence upload with SHA-256 hashing, and immutable chain-of-custody tracking. |
| **09** | **SIS Access Guardian** | Centralized access governance, active session revocation, login anomaly alerts, and access policy overview. |
| **10** | **SIS Threat Intelligence** | Indicators of Compromise (IOC) management (IP, Domain, URL, Hash), feed status, confidence scoring, and search. |
| **11** | **SIS Cloud Backup Guardian** | Backup job scheduling, encrypted storage management, restoration workflows, and file integrity verification. |
| **12** | **SIS Cyber SOC** | Centralized security incident triage, alert aggregation across all modules, analyst investigation notes, and status workflows. |

### 3.5 Centralized Supporting Services
- **Audit Logging Service:** Append-only logging of administrative actions, authentication attempts, custody events, and configuration modifications.
- **Notification Center:** In-app notification delivery with read/unread tracking, severity filters, and real-time alerts.
- **System Health Monitor:** Real-time diagnostics of API runtime, database connections, cache readiness, and external integration status.
- **Reporting & Analytics:** Tabular and visual exports of security events, compliance audits, and incident resolution timelines.

---

## 4. Technical Constraints & Security Standards

- **Backend:** NestJS 10.x, TypeScript 5.x, REST API with Swagger documentation at `/api/docs`.
- **Database:** PostgreSQL with Prisma ORM 5/6, relational foreign keys, UUID primary keys, and indexed query paths.
- **Frontend:** Next.js 14+ (App Router), React 18/19, Tailwind CSS, Lucide React, Recharts.
- **Testing:** Unit tests, integration tests, and role-based access verification suites.
