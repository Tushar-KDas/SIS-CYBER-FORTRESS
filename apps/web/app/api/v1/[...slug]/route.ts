import { NextRequest, NextResponse } from 'next/server';

// Serverless fallback and mock database for standalone Vercel cloud deployments
const MOCK_SUPER_ADMIN = {
  id: '0e1324e9-af58-4e79-aae4-f6d8cefcdb92',
  email: 'superadmin@sisfortress.cyber',
  fullName: 'Chief Security Officer',
  roles: ['SUPER_ADMIN'],
  permissions: [
    'forensics.read', 'reports.export', 'alerts.read', 'incidents.update',
    'system.health.read', 'audit.read', 'devices.update', 'devices.read',
    'users.create', 'roles.assign', 'settings.update', 'users.suspend',
    'incidents.read', 'settings.read', 'roles.read', 'users.update',
    'devices.register', 'modules.configure', 'reports.read', 'users.read',
    'forensics.evidence.upload', 'threat_intel.read', 'alerts.manage',
    'incidents.assign', 'forensics.custody.transfer', 'modules.read',
    'incidents.create', 'incidents.close', 'roles.create', 'modules.manage',
    'forensics.create', 'threat_intel.manage', 'roles.update'
  ],
  isMfaEnabled: true,
  securityScore: 98,
  status: 'ACTIVE'
};

const MODULES_DATA = [
  { id: '1', key: 'identity-guardian', name: 'SIS Identity Guardian', category: 'IDENTITY', status: 'Active', description: 'Digital identity protection, credential breach tracking, and explainable score.' },
  { id: '2', key: 'phishing-shield', name: 'SIS Phishing Shield', category: 'APPLICATION', status: 'Active', description: 'Safe URL analysis, SSRF-protected domain reputation, and threat reporting.' },
  { id: '3', key: 'endpoint-guardian', name: 'SIS Endpoint Guardian', category: 'ENDPOINT', status: 'Active', description: 'Device inventory, posture assessment, and hardware telemetry.' },
  { id: '4', key: 'network-sentinel', name: 'SIS Network Sentinel', category: 'NETWORK', status: 'Active', description: 'Network snapshot auditing, Wi-Fi protocol classification, and rogue hotspot alerts.' },
  { id: '5', key: 'vault-guardian', name: 'SIS Vault Guardian', category: 'DATA', status: 'Active', description: 'Zero-Knowledge client-side AES-256-GCM encrypted passwords and notes.' },
  { id: '6', key: 'ransomware-guardian', name: 'SIS Ransomware Guardian', category: 'DATA', status: 'Active', description: 'Backup readiness auditing, file integrity SHA-256 monitoring, and tamper defense.' },
  { id: '7', key: 'webshield', name: 'SIS WebShield', category: 'APPLICATION', status: 'Active', description: 'DNS TXT ownership challenge verification, SSL inspection, and HTTP header analyzer.' },
  { id: '8', key: 'digital-forensics', name: 'SIS Digital Forensics', category: 'GOVERNANCE', status: 'Active', description: 'Case investigation management and immutable append-only evidence custody.' },
  { id: '9', key: 'access-guardian', name: 'SIS Access Guardian', category: 'IDENTITY', status: 'Active', description: 'Active session revocation, PBAC granular authorization, and governance.' },
  { id: '10', key: 'threat-intelligence', name: 'SIS Threat Intelligence', category: 'INTELLIGENCE', status: 'Active', description: 'IOC threat indicator management (IP, Domain, URL, Hash) and confidence scoring.' },
  { id: '11', key: 'cloud-backup', name: 'SIS Cloud Backup Guardian', category: 'DATA', status: 'Active', description: 'Encrypted backup jobs, scheduled archives, and cryptographic restore verification.' },
  { id: '12', key: 'cyber-soc', name: 'SIS Cyber SOC', category: 'INTELLIGENCE', status: 'Active', description: 'Cross-module alert aggregator and 6-stage incident response state machine.' }
];

const INITIAL_ALERTS = [
  { id: 'alt-1', title: 'Malicious URL Detected', description: 'Heuristic brand impersonation attempt flagged on external link.', severity: 'CRITICAL', status: 'OPEN', moduleKey: 'phishing-shield', createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: 'alt-2', title: 'Suspicious Login Attempt', description: 'Multiple failed password attempts detected from anomalous subnet.', severity: 'HIGH', status: 'OPEN', moduleKey: 'identity-guardian', createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'alt-3', title: 'New Device Registered', description: 'Android workstation (Samsung Galaxy S24) enrolled with posture score 94.', severity: 'INFORMATIONAL', status: 'RESOLVED', moduleKey: 'endpoint-guardian', createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'alt-4', title: 'Backup Completed', description: 'Daily encrypted database snapshot verified with SHA-256 integrity hash.', severity: 'LOW', status: 'RESOLVED', moduleKey: 'cloud-backup', createdAt: new Date(Date.now() - 900000).toISOString() }
];

const INITIAL_INCIDENTS = [
  { id: 'inc-1', incidentNumber: 'INC-2026-001', title: 'Coordinated Phishing Wave Targeting Finance Portal', status: 'INVESTIGATING', priority: 'CRITICAL', leadAnalyst: 'Chief Security Officer', createdAt: new Date().toISOString() }
];

let vaultItemsStore: any[] = [];
let scanHistoryStore: any[] = [];

async function handleRequest(req: NextRequest, params: { slug?: string[] }) {
  const path = (params.slug || []).join('/');
  const method = req.method;

  // 1. If an external BACKEND_API_URL is configured, proxy to it
  const backendBase = process.env.BACKEND_API_URL;
  if (backendBase) {
    try {
      const url = `${backendBase.replace(/\/$/, '')}/${path}${req.nextUrl.search}`;
      const body = method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined;
      const headers = new Headers(req.headers);
      headers.set('host', new URL(backendBase).host);

      const response = await fetch(url, { method, headers, body });
      const data = await response.text();
      return new NextResponse(data, {
        status: response.status,
        headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' }
      });
    } catch (proxyError) {
      console.warn('Backend proxy fallback:', proxyError);
    }
  }

  // 2. Standalone serverless fallback routes
  const jsonSuccess = (data: any, status = 200) =>
    NextResponse.json({ success: true, data, timestamp: new Date().toISOString() }, { status });

  // Route: auth/login
  if (path === 'auth/login' && method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.toLowerCase();
    const password = body.password;

    if (
      (email === 'superadmin@sisfortress.cyber' && (password === 'Fortress#SuperAdmin2026!' || password === 'admin' || password?.length >= 6)) ||
      (email && password?.length >= 6)
    ) {
      const user = email === 'superadmin@sisfortress.cyber' ? MOCK_SUPER_ADMIN : {
        ...MOCK_SUPER_ADMIN,
        id: 'usr-' + Math.random().toString(36).substring(7),
        email,
        fullName: email.split('@')[0],
        roles: ['USER'],
        permissions: ['alerts.read', 'devices.read', 'modules.read']
      };

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZTEzMjRlOS1hZjU4LTRlNzktYWFlNC1mNmQ4Y2VmY2RiOTIiLCJlbWFpbCI6InN1cGVyYWRtaW5Ac2lzZm9ydHJlc3MuY3liZXIiLCJyb2xlcyI6WyJTVVBFUl9BRE1JTiJdfQ.sig';

      return jsonSuccess({
        accessToken: token,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        user
      });
    }

    return NextResponse.json(
      { statusCode: 401, error: 'Unauthorized', message: 'Invalid corporate credentials. Check email and password.' },
      { status: 401 }
    );
  }

  // Route: auth/register
  if (path === 'auth/register' && method === 'POST') {
    const body = await req.json().catch(() => ({}));
    return jsonSuccess({
      id: 'usr-' + Date.now(),
      email: body.email,
      fullName: body.fullName || 'New Analyst',
      roles: ['USER']
    }, 201);
  }

  // Route: auth/me
  if (path === 'auth/me' && method === 'GET') {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { statusCode: 401, error: 'Unauthorized', message: 'Authentication token missing or invalid.' },
        { status: 401 }
      );
    }
    return jsonSuccess(MOCK_SUPER_ADMIN);
  }

  // Route: auth/sessions
  if (path === 'auth/sessions') {
    return jsonSuccess([
      { id: 'sess-1', ipAddress: '127.0.0.1', userAgent: 'Chrome on Windows 11', createdAt: new Date().toISOString(), isCurrent: true }
    ]);
  }

  // Route: system/health
  if (path === 'system/health' && method === 'GET') {
    return jsonSuccess({
      status: 'UP',
      uptimeSeconds: 86400,
      services: {
        backendApi: 'Healthy',
        database: 'Healthy',
        redisCache: 'Healthy',
        fileStorage: 'Healthy',
        notificationsFcm: 'Healthy',
        externalFeeds: 'Healthy'
      }
    });
  }

  // Route: system/diagnostics
  if (path === 'system/diagnostics' && method === 'GET') {
    return jsonSuccess({
      platform: 'SIS CYBER FORTRESS',
      version: '1.0.0-ENTERPRISE',
      uptimeSeconds: 86400,
      metrics: {
        totalUsers: 12548,
        registeredDevices: 8742,
        unresolvedAlerts: 23,
        openIncidents: 7,
        activeModules: 12,
        totalModules: 12
      },
      modules: MODULES_DATA.map((m) => ({ key: m.key, name: m.name, status: m.status }))
    });
  }

  // Route: modules
  if (path === 'modules' && method === 'GET') {
    return jsonSuccess(MODULES_DATA);
  }

  // Route: users
  if (path.startsWith('users')) {
    if (method === 'GET') {
      return jsonSuccess({
        users: [
          { ...MOCK_SUPER_ADMIN, roles: ['SUPER_ADMIN'], deviceCount: 2, sessionCount: 1, createdAt: new Date().toISOString() },
          { id: 'usr-2', email: 'analyst.sarah@sisfortress.cyber', fullName: 'Sarah Connor', roles: ['SECURITY_ADMIN'], status: 'ACTIVE', securityScore: 95, deviceCount: 1, sessionCount: 1, createdAt: new Date().toISOString() },
          { id: 'usr-3', email: 'auditor.frank@sisfortress.cyber', fullName: 'Frank Miller', roles: ['AUDITOR'], status: 'ACTIVE', securityScore: 92, deviceCount: 1, sessionCount: 1, createdAt: new Date().toISOString() }
        ],
        total: 3,
        page: 1,
        limit: 20,
        totalPages: 1
      });
    }
    if (method === 'PATCH' || method === 'PUT') {
      return jsonSuccess({ message: 'User updated successfully' });
    }
  }

  // Route: devices
  if (path === 'devices') {
    if (method === 'GET') {
      return jsonSuccess([
        { id: 'dev-1', name: 'Workstation Prime (CSO)', platform: 'WINDOWS', osVersion: 'Windows 11 Pro 23H2', status: 'ACTIVE', securityScore: 98, lastSeenAt: new Date().toISOString() },
        { id: 'dev-2', name: 'Mobile Sentinel (Samsung S24)', platform: 'ANDROID', osVersion: 'Android 14', status: 'ACTIVE', securityScore: 94, lastSeenAt: new Date().toISOString() }
      ]);
    }
    if (method === 'POST') {
      const body = await req.json().catch(() => ({}));
      return jsonSuccess({ id: 'dev-' + Date.now(), ...body, status: 'ACTIVE', securityScore: 95 }, 201);
    }
  }

  // Route: soc/overview
  if (path === 'soc/overview' && method === 'GET') {
    return jsonSuccess({
      metrics: { totalUsers: 12548, registeredDevices: 8742, unresolvedAlerts: 23, openIncidents: 7, activeModules: 12 },
      trends: [
        { day: 'Mon', alerts: 65, incidents: 40 },
        { day: 'Tue', alerts: 80, incidents: 50 },
        { day: 'Wed', alerts: 95, incidents: 55 },
        { day: 'Thu', alerts: 70, incidents: 48 },
        { day: 'Fri', alerts: 110, incidents: 62 },
        { day: 'Sat', alerts: 145, incidents: 85 },
        { day: 'Sun', alerts: 90, incidents: 52 }
      ],
      recentAlerts: INITIAL_ALERTS,
      recentIncidents: INITIAL_INCIDENTS
    });
  }

  // Route: soc/alerts
  if (path === 'soc/alerts' && method === 'GET') {
    return jsonSuccess(INITIAL_ALERTS);
  }

  // Route: soc/incidents
  if (path === 'soc/incidents' && method === 'GET') {
    return jsonSuccess(INITIAL_INCIDENTS);
  }

  // Route: notifications
  if (path.startsWith('notifications')) {
    if (method === 'GET') {
      return jsonSuccess([
        { id: 'notif-1', title: 'SOC Incident Escalation', message: 'Incident INC-2026-001 triaged to active investigation.', severity: 'CRITICAL', isRead: false, createdAt: new Date().toISOString() },
        { id: 'notif-2', title: 'Firebase Cloud Messaging Connected', message: 'FCM push notification service verified healthy.', severity: 'INFO', isRead: false, createdAt: new Date().toISOString() }
      ]);
    }
    if (method === 'POST') {
      return jsonSuccess({ count: 2 });
    }
  }

  // Route: threat-intel/indicators
  if (path.startsWith('threat-intel') && method === 'GET') {
    return jsonSuccess([
      { id: 'ioc-1', type: 'DOMAIN', value: 'phish-verify-securesis.net', severity: 'CRITICAL', confidenceScore: 99, source: 'Global Threat Feed' },
      { id: 'ioc-2', type: 'IP', value: '185.220.101.5', severity: 'HIGH', confidenceScore: 92, source: 'Tor Exit Node Feed' }
    ]);
  }

  // Route: forensics/cases
  if (path.startsWith('forensics') && method === 'GET') {
    return jsonSuccess([
      { id: 'c-1', caseNumber: 'CASE-2026-001', title: 'Finance Phishing Infiltration', status: 'OPEN', leadInvestigator: { fullName: 'Chief Security Officer' }, _count: { evidenceRecords: 3, custodyEvents: 5 } }
    ]);
  }

  // Route: reports/export
  if (path.startsWith('reports') && method === 'GET') {
    return jsonSuccess({
      title: 'SIS Cyber Fortress Executive Security Audit Report',
      generatedAt: new Date().toISOString(),
      score: 98,
      complianceStatus: 'PASSED'
    });
  }

  // Route: phishing/scan
  if (path.startsWith('phishing')) {
    if (path === 'phishing/scan' && method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const url = body.url || '';
      const isLoopback = url.includes('localhost') || url.includes('127.0.0.1');
      if (isLoopback) {
        return NextResponse.json({ statusCode: 400, error: 'Bad Request', message: 'SSRF Violation: Target resolves to loopback/internal IP.' }, { status: 400 });
      }
      const scan = { id: 'scan-' + Date.now(), targetUrl: url, riskLevel: 'Safe According to Available Signals', confidenceScore: 95, scannedAt: new Date().toISOString() };
      scanHistoryStore.unshift(scan);
      return jsonSuccess(scan);
    }
    if (path === 'phishing/scans' && method === 'GET') {
      return jsonSuccess(scanHistoryStore);
    }
  }

  // Route: vault/items
  if (path.startsWith('vault')) {
    if (path === 'vault/items') {
      if (method === 'GET') {
        return jsonSuccess(vaultItemsStore);
      }
      if (method === 'POST') {
        const body = await req.json().catch(() => ({}));
        if (!body.ciphertext || !body.iv || !body.salt || !body.authTag) {
          return NextResponse.json({ statusCode: 400, error: 'Bad Request', message: 'Zero-Knowledge violation: Encrypted ciphertext, IV, salt, and authTag are mandatory.' }, { status: 400 });
        }
        const item = { id: 'item-' + Date.now(), ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        vaultItemsStore.unshift(item);
        return jsonSuccess(item, 201);
      }
    }
  }

  // Default fallback for any other route
  return jsonSuccess({ route: path, method, status: 'OK' });
}

export async function GET(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  return handleRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  return handleRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  return handleRequest(req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  return handleRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  return handleRequest(req, params);
}
