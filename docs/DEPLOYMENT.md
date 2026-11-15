# SIS CYBER FORTRESS — PRODUCTION DEPLOYMENT SPECIFICATION
**Version:** 1.0.0  
**Target Environments:** Containerized (Docker Compose / Kubernetes) & Cloud Bare-Metal  

---

## 1. Production Architecture Overview

In production, SIS CYBER FORTRESS deploys via containerized services orchestrated through Docker Compose or Kubernetes:
- `sis-web`: Next.js production build served on Port 3000 behind reverse proxy.
- `sis-api`: NestJS Node.js production service on Port 4000.
- `sis-db`: Managed PostgreSQL 16 database with persistent storage and daily snapshots.
- `sis-redis`: In-memory Redis 7 instance for distributed rate-limiting and caching.
- `sis-ingress`: NGINX / Caddy reverse proxy handling TLS termination, HTTP/2, security headers, and rate-limiting.

---

## 2. Environment Configuration Checklist

Prior to production launch, verify the following variables in `.env`:
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `DATABASE_URL`: Production PostgreSQL connection string with SSL enabled (`?sslmode=require`).
- [ ] `JWT_SECRET`: High-entropy random key (min 64 characters).
- [ ] `COOKIE_SECRET`: High-entropy random key (min 64 characters).
- [ ] `CORS_ORIGIN`: Exact production domain (e.g. `https://cyberfortress.enterprise.com`).
- [ ] `BOOTSTRAP_ADMIN_*`: Remove temporary bootstrap credentials from environment once initialized.

---

## 3. Database Migration & Initialization Workflow

```bash
# 1. Apply database schema migrations
npx prisma migrate deploy

# 2. Seed system roles, permissions, and initial module catalog
npm run prisma:seed

# 3. Provision the initial Super Admin account
npm run bootstrap:admin
```

---

## 4. Containerized Launch with Docker Compose

```bash
docker compose -f docker-compose.yml up -d --build
```

Check health:
```bash
curl -f http://localhost:4000/api/v1/system/health
```
