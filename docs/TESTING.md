# SIS CYBER FORTRESS — TESTING STRATEGY & VERIFICATION SPECIFICATION
**Version:** 1.0.0  
**Frameworks:** Jest, Supertest, React Testing Library  

---

## 1. Test Architecture

The testing matrix comprises three primary layers:
1. **Unit Tests (`*.spec.ts`):**
   - Authentication services (Argon2id hashing, TOTP validation, JWT generation).
   - RBAC Guards (`RolesGuard`, `PermissionsGuard`, `ModuleAccessGuard`).
   - Domain modules business logic (Phishing Shield heuristic classifier, Vault payload validation, Incident state machine).
2. **Integration & API Tests (`*.e2e-spec.ts`):**
   - Direct HTTP endpoint testing against NestJS application instance.
   - Database operations, foreign key constraints, and cascade policies.
   - Authentication workflows: Registration, Login, MFA challenge, Session invalidation.
   - RBAC enforcement: 403 Forbidden validation on unprivileged role requests.
3. **End-to-End Verification:**
   - Public website navigation and form interactions.
   - User security dashboard workflow.
   - Admin dashboards (Super Admin, Security Admin, Module Admin, Auditor) authorization boundaries.

---

## 2. Test Execution Commands

```bash
# Run unit tests across all workspaces
npm run test

# Run API unit and controller tests
npm run test --workspace=@sis/api

# Run End-to-End API tests
npm run test:e2e --workspace=@sis/api
```

---

## 3. Mandatory Test Coverage Areas

| Category | Target Test Suites |
|---|---|
| **Auth** | Password hashing, verification failure, rate limiting, MFA generation & verification, session revocation. |
| **RBAC** | Unauthenticated 401, unauthorized role 403, auditor read-only mutability rejection, module admin boundary scoping. |
| **SSRF** | Loopback IP rejection (`127.0.0.1`, `localhost`), Private RFC1918 IP rejection (`10.0.0.1`, `192.168.1.1`), AWS metadata rejection (`169.254.169.254`). |
| **Forensics** | SHA-256 hash calculation, append-only custody event creation. |
| **Vault** | Cryptographic payload integrity, zero plaintext leakage on server. |
| **SOC** | Incident status transitions (`NEW` -> `TRIAGED` -> `INVESTIGATING` -> `CONTAINMENT` -> `RESOLVED` -> `CLOSED`), invalid transition rejection. |
