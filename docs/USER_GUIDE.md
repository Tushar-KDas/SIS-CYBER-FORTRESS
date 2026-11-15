# SIS CYBER FORTRESS — END-USER OPERATIONAL GUIDE
**Target Audience:** Standard Enterprise Users (`USER` Role)  
**Portal URL:** `http://localhost:3000/dashboard`  

---

## 1. Getting Started

### 1.1 Account Registration & Setup
1. Navigate to `/register`.
2. Provide your work email, name, and strong password (minimum 8 characters with numbers and symbols).
3. Upon registration, log in at `/login`.
4. Proceed immediately to `/dashboard/settings` to enable **Multi-Factor Authentication (MFA)** using an authenticator app (Google Authenticator, Authy, or 1Password).

### 1.2 Navigating the User Security Console
- **Dashboard Overview:** Displays your personal security score, active alerts, enrolled devices, and quick links to security modules.
- **My Devices (`/dashboard/devices`):** View all laptops, desktops, and mobile devices registered to your account. Monitor OS patch levels and sync status.
- **Security Alerts (`/dashboard/alerts`):** View security notifications affecting your account, devices, or assets.
- **Scan History (`/dashboard/scans`):** Historical log of your Phishing Shield and WebShield scans.
- **Threat Reports (`/dashboard/threat-reports`):** Submit suspicious URLs, emails, or malicious attachments to the security operations center.
- **My Sessions (`/dashboard/sessions`):** View all active browser sessions with IP address, device, and last active time. Revoke any unrecognized session instantly.

---

## 2. Using Core Security Modules

### 2.1 SIS Vault Guardian (`/dashboard/modules/vault-guardian`)
- **Zero-Knowledge Architecture:** Your credentials and notes are encrypted on your device using AES-256-GCM before transmission. The server cannot decrypt your records.
- **Adding Items:** Click "New Vault Item", select category (Password, Secure Note, Credential), fill in details, and save.
- **Unlocking Vault:** Enter your master passphrase to decrypt stored items client-side.

### 2.2 SIS Phishing Shield (`/dashboard/modules/phishing-shield`)
- Paste any suspicious URL into the scanner input.
- Click "Analyze URL" to run real-time domain reputation checks and heuristic threat classification.
- Review risk ratings: `Safe According to Available Signals`, `Suspicious`, `Malicious`, or `Unknown`.

### 2.3 SIS Network Sentinel (`/dashboard/modules/network-sentinel`)
- Complete the Network Security Checklist to verify your current connection security.
- Record Wi-Fi snapshot audits to verify encryption protocols.
