# SIS CYBER FORTRESS — ENTERPRISE SECURITY SPECIFICATION
**Version:** 1.0.0  
**Scope:** Cryptography, Authentication, Network Hardening, Threat Defense & Privacy  

---

## 1. Password Hashing & Key Derivation

- **Algorithm:** Argon2id (RFC 9106)
- **Parameters:**
  - Memory Cost: 65,536 KiB (64 MiB)
  - Iterations: 3 passes
  - Parallelism: 4 lanes
  - Hash Length: 32 bytes
- **Invariants:**
  - Plaintext passwords are NEVER stored, printed to logs, or cached in session stores.
  - Legacy MD5, SHA-1, and unsalted SHA-256 for passwords are strictly rejected.

---

## 2. Zero-Knowledge Cryptography (SIS Vault Guardian)

- **Client-Side Encryption:**
  - Master Key Derivation: PBKDF2 / Argon2id derived exclusively in the user's browser runtime.
  - Cipher: AES-256-GCM with 128-bit authentication tag.
  - Nonce / IV: Unique cryptographically random 96-bit Initialization Vector generated per encryption operation. Nonce reuse is strictly prohibited.
- **Server Zero-Knowledge Boundary:**
  - The backend only accepts, validates, and stores: `ciphertext`, `iv`, `salt`, and `authTag`.
  - The server does not possess the user's master key, nor does it possess recovery escrow keys.
  - A compromised database or malicious administrator CANNOT read stored vault credentials or secure notes.

---

## 3. Server-Side Request Forgery (SSRF) Mitigations (WebShield & Phishing Shield)

Whenever SIS CYBER FORTRESS performs automated scans of user-provided hostnames or URLs:
1. **Target Validation:** Hostnames are parsed using standard URI parsers. IP address literals in URLs are strictly inspected.
2. **DNS Pre-Resolution:**
   - Hostname is resolved to IPv4 and IPv6 addresses prior to any network connection.
   - If the resolved IP belongs to any restricted range, the request is instantly rejected:
     - `127.0.0.0/8` (Loopback)
     - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (Private RFC 1918)
     - `169.254.0.0/16` (Link-local cloud metadata e.g. AWS 169.254.169.254)
     - `::1`, `fc00::/7`, `fe80::/10` (IPv6 loopback & private)
3. **Redirect Protection:**
   - Client follows at most 3 redirects.
   - Every redirection target URL undergoes the exact same DNS resolution and IP validation check to prevent DNS rebinding attacks.
4. **Limits:** Hard 5-second socket timeout and 1MB maximum payload response size limit.

---

## 4. Role-Based Access Control (RBAC) & Privileged Access

- All protected routes and API endpoints require NestJS Guards (`JwtAuthGuard`, `RolesGuard`, `PermissionsGuard`, `ModuleAccessGuard`).
- Separation of Duties:
  - `AUDITOR` accounts have read-only access to audit logs and incidents; they cannot edit incidents, change roles, or modify system parameters.
  - `MODULE_ADMIN` privileges are dynamically scoped to assigned module keys in the database.
  - Super Admin modifications require active MFA status.

---

## 5. Append-Only Forensics Chain of Custody

- Evidence uploads compute SHA-256 checksums immediately upon ingestion.
- The `CustodyEvent` table operates on an append-only invariant:
  - Updates (`UPDATE`) and Deletions (`DELETE`) on custody event records are blocked at both database and application layers.
  - Every access, transfer, or status change produces a new custody record with timestamp, actor ID, previous custodian, new custodian, and tamper reason.
