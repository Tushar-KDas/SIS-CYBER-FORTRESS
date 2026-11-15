# SIS CYBER FORTRESS — 12-in-1 Enterprise Cybersecurity Ecosystem

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-teal.svg)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

> **"Your Digital World. One Unified Cyber Defense."**  
> An integrated cybersecurity ecosystem designed to protect digital identity, devices, applications, networks, and critical information through centralized security intelligence.

---

## 1. System Architecture Overview

SIS CYBER FORTRESS is engineered as a clean **Modular Monolith** containing:
- **Public Portal:** High-impact enterprise cybersecurity showcase, 12-module directory, architecture preview, interactive demo score, and onboarding.
- **Unified Rest API:** Scalable NestJS backend with Swagger documentation at `/api/docs`.
- **Relational Persistence:** PostgreSQL with Prisma ORM, strict UUID primary keys, and index-optimized relational schemas.
- **Enterprise RBAC:** 5 distinct privilege levels (`SUPER_ADMIN`, `SECURITY_ADMIN`, `MODULE_ADMIN`, `AUDITOR`, `USER`).
- **4 Dedicated Admin Experiences:**
  1. Super Admin Control Center (`/admin/super-admin`)
  2. Security Operations Center (SOC) Desk (`/admin/security-admin`)
  3. Scoped Module Admin Workspace (`/admin/module-admin`)
  4. Compliance Auditor Portal (`/admin/auditor`)
- **End-User Security Console:** Device management, alert dashboard, zero-knowledge vault, and account security at `/dashboard`.

---

## 2. The 12 Cybersecurity Modules

1. **SIS Identity Guardian:** Digital identity protection, login activity audit, account security score based on explainable signals, and credential breach detection.
2. **SIS Phishing Shield:** Safe URL analysis, SSRF-protected domain reputation scanner, heuristic risk classification, and threat reporting.
3. **SIS Endpoint Guardian:** Device inventory, security posture assessment, and preparation for Android sync.
4. **SIS Network Sentinel:** Network snapshot audits, Wi-Fi security classification, and rogue hotspot alerts.
5. **SIS Vault Guardian:** Zero-Knowledge client-side AES-256-GCM encrypted password and secure note vault. Plaintext never touches the server.
6. **SIS Ransomware Guardian:** Backup readiness auditing, safe file integrity monitoring, and recovery checklist workflows.
7. **SIS WebShield:** Authorized asset ownership verification (DNS TXT challenge), SSL/TLS inspection, HTTP security header analyzer, and SSRF-hardened scanner.
8. **SIS Digital Forensics:** Case investigation management, SHA-256 hashed evidence custody, and immutable append-only chain-of-custody tracking.
9. **SIS Access Guardian:** Centralized active session revocation, login anomaly alerts, and access governance.
10. **SIS Threat Intelligence:** Indicator of Compromise (IOC) management (IP, Domain, URL, Hashes), feed sync, and confidence scoring.
11. **SIS Cloud Backup Guardian:** Backup job scheduling, encrypted storage management, and cryptographic restore verification.
12. **SIS Cyber SOC:** Unified alert aggregator, investigation notes, and multi-stage incident response state machine (`NEW` -> `TRIAGED` -> `INVESTIGATING` -> `CONTAINMENT` -> `RESOLVED` -> `CLOSED`).

---

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend:** NestJS 10, TypeScript, REST API, Swagger / OpenAPI, Passport, Class-Validator, Helmet.
- **Database & ORM:** PostgreSQL 16, Prisma ORM 5.
- **Cryptography & Security:** Argon2id password hashing, RFC 6238 TOTP MFA, AES-256-GCM client encryption, SSRF protection guards, HttpOnly SameSite secure cookies.
- **Infrastructure:** Docker, Docker Compose, Git.

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (optional for containerized PostgreSQL / Redis)

### Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/organization/sis-cyber-fortress.git
   cd sis-cyber-fortress
   ```

2. **Setup environment variables:**
   ```bash
   copy .env.example .env
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build shared contracts:**
   ```bash
   npm run build:contracts
   ```

5. **Initialize Database:**
   ```bash
   # Push schema to database
   npm run prisma:push

   # Seed default roles, permissions, modules, and reference parameters
   npm run prisma:seed

   # Bootstrap initial Super Admin (Secure CLI)
   npm run bootstrap:admin
   ```

6. **Start Development Servers:**
   ```bash
   # Start API (Port 4000)
   npm run dev:api

   # Start Web (Port 3000)
   npm run dev:web
   ```

7. **Access Services:**
   - Web Platform: `http://localhost:3000`
   - User Dashboard: `http://localhost:3000/dashboard`
   - Super Admin: `http://localhost:3000/admin/super-admin`
   - API Documentation (Swagger): `http://localhost:4000/api/docs`
   - API Health Diagnostics: `http://localhost:4000/api/v1/system/health`

---

## 5. First Super Admin Bootstrap

For defense-in-depth, there is **no default administrator password** and **no public super admin registration endpoint**.

To provision the first Super Admin:
```bash
npm run bootstrap:admin
```
The command reads `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, and `BOOTSTRAP_ADMIN_NAME` from `.env`, validates password complexity (min 12 chars, upper, lower, digit, special symbol), hashes with Argon2id, assigns the `SUPER_ADMIN` role with full permissions, and prevents repeated bootstrap runs.

---

## 6. Testing

```bash
# Run all unit tests
npm run test

# Run API specific tests
npm run test --workspace=@sis/api
```

---

## 7. License

Enterprise Proprietary & Confidential. All rights reserved.
