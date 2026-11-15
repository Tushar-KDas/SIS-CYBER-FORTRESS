import { PrismaClient } from '@prisma/client';
import * as argon2 from '@node-rs/argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (password.length < 12) {
    return { valid: false, reason: 'Password must be at least 12 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one digit.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

async function bootstrapFirstSuperAdmin() {
  console.log('=====================================================');
  console.log(' SIS CYBER FORTRESS — FIRST SUPER ADMIN BOOTSTRAP CLI');
  console.log('=====================================================');

  // Check if a Super Admin already exists to prevent repeated bootstrap
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (!superAdminRole) {
    console.error('[ERROR] The SUPER_ADMIN role is not seeded yet. Please run `npm run prisma:seed` first.');
    process.exit(1);
  }

  const existingSuperAdminAssignment = await prisma.userRole.findFirst({
    where: { roleId: superAdminRole.id },
    include: { user: true },
  });

  if (existingSuperAdminAssignment) {
    console.warn(`[REJECTED] A Super Admin already exists on this platform (${existingSuperAdminAssignment.user.email}).`);
    console.warn('Repeated execution of the bootstrap procedure is strictly prohibited for security integrity.');
    process.exit(0);
  }

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || 'superadmin@sisfortress.cyber';
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'Fortress#SuperAdmin2026!';
  const fullName = process.env.BOOTSTRAP_ADMIN_NAME || 'Chief Security Officer';

  const check = validatePasswordStrength(password);
  if (!check.valid) {
    console.error(`[ERROR] Insecure bootstrap password: ${check.reason}`);
    process.exit(1);
  }

  console.log(`[BOOTSTRAP] Hashing password with Argon2id (OWASP recommended parameters)...`);
  const passwordHash = await argon2.hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  console.log(`[BOOTSTRAP] Creating Super Admin record: ${email}...`);
  const adminUser = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      status: 'ACTIVE',
      isMfaEnabled: true, // Super Admin requires MFA
      securityScore: 100,
    },
  });

  // Assign SUPER_ADMIN role
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  // Log Audit record for Super Admin Bootstrap
  await prisma.auditLog.create({
    data: {
      actorUserId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'BOOTSTRAP_SUPER_ADMIN_CREATED',
      resourceType: 'User',
      resourceId: adminUser.id,
      outcome: 'SUCCESS',
      metadataJson: JSON.stringify({
        method: 'CLI_BOOTSTRAP',
        timestamp: new Date().toISOString(),
      }),
    },
  });

  console.log('-----------------------------------------------------');
  console.log('[SUCCESS] Super Admin account created successfully!');
  console.log(`Email:     ${adminUser.email}`);
  console.log(`User ID:   ${adminUser.id}`);
  console.log(`MFA:       Required (Configure upon first login at /login)`);
  console.log('-----------------------------------------------------');
  console.log('[SECURITY ADVISORY] Please remove BOOTSTRAP_ADMIN_PASSWORD from your active environment.');
  console.log('=====================================================');
}

bootstrapFirstSuperAdmin()
  .catch((err) => {
    console.error('[BOOTSTRAP FATAL ERROR]', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
