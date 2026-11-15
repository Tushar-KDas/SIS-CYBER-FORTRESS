import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: App | null = null;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      this.firebaseApp = existingApps[0];
      this.logger.log('Firebase Admin SDK is already initialized.');
      return;
    }

    try {
      // 1. Check for dedicated service account JSON file
      const potentialPaths = [
        path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'firebase-service-account.json'),
        path.resolve(process.cwd(), 'apps/api', 'firebase-service-account.json'),
        path.resolve(__dirname, '..', '..', '..', 'firebase-service-account.json'),
      ];

      for (const p of potentialPaths) {
        if (fs.existsSync(p)) {
          const serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
          this.firebaseApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id,
          });
          this.logger.log(`Firebase Admin SDK successfully connected to project: ${serviceAccount.project_id}`);
          return;
        }
      }

      // 2. Alternatively check environment variables
      if (process.env.FCM_PROJECT_ID && process.env.FCM_CLIENT_EMAIL && process.env.FCM_PRIVATE_KEY) {
        this.firebaseApp = initializeApp({
          credential: cert({
            projectId: process.env.FCM_PROJECT_ID,
            clientEmail: process.env.FCM_CLIENT_EMAIL,
            privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          projectId: process.env.FCM_PROJECT_ID,
        });
        this.logger.log(`Firebase Admin SDK successfully initialized via ENV for project: ${process.env.FCM_PROJECT_ID}`);
      } else {
        this.logger.warn('Firebase service account credentials not found. Notifications will operate in database-only mode.');
      }
    } catch (err: any) {
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${err?.message || err}`);
    }
  }

  isFirebaseConnected(): boolean {
    return this.firebaseApp !== null;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    severity = 'INFO',
    moduleKey?: string,
    linkUrl?: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        severity,
        moduleKey,
        linkUrl,
      },
    });

    // Send push notification via Firebase Cloud Messaging if configured
    if (this.firebaseApp) {
      try {
        const messaging = getMessaging(this.firebaseApp);
        await messaging.send({
          topic: `user-${userId}`,
          notification: {
            title: `[SIS FORTRESS] ${title}`,
            body: message,
          },
          data: {
            notificationId: notification.id,
            severity,
            moduleKey: moduleKey || 'general',
            linkUrl: linkUrl || '/dashboard/notifications',
          },
        });
        this.logger.log(`FCM push notification dispatched to topic: user-${userId}`);
      } catch (fcmError: any) {
        // Log gracefully without failing the notification creation
        this.logger.warn(`FCM dispatch attempt logged: ${fcmError?.message || fcmError}`);
      }
    }

    return notification;
  }
}
