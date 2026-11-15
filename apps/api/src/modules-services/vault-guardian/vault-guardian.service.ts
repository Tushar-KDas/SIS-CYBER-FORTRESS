import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface CreateVaultItemInput {
  title: string;
  category: string;
  ciphertext: string;
  iv: string;
  salt: string;
  authTag: string;
}

@Injectable()
export class VaultGuardianService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, input: CreateVaultItemInput) {
    if (!input.ciphertext || !input.iv || !input.salt || !input.authTag) {
      throw new BadRequestException(
        'Zero-Knowledge violation: Encrypted ciphertext, IV, salt, and authentication tag are mandatory.',
      );
    }

    const item = await this.prisma.vaultItem.create({
      data: {
        userId,
        title: input.title,
        category: input.category || 'PASSWORD',
        ciphertext: input.ciphertext,
        iv: input.iv,
        salt: input.salt,
        authTag: input.authTag,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'VAULT_ITEM_CREATED',
        resourceType: 'VaultItem',
        resourceId: item.id,
        outcome: 'SUCCESS',
        metadataJson: JSON.stringify({ category: item.category, title: item.title }),
      },
    });

    return item;
  }

  async findAll(userId: string) {
    return this.prisma.vaultItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(userId: string, id: string) {
    const item = await this.prisma.vaultItem.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Vault item not found.');
    return item;
  }

  async update(userId: string, id: string, input: Partial<CreateVaultItemInput>) {
    const existing = await this.prisma.vaultItem.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Vault item not found.');

    const updated = await this.prisma.vaultItem.update({
      where: { id },
      data: {
        title: input.title,
        category: input.category,
        ciphertext: input.ciphertext,
        iv: input.iv,
        salt: input.salt,
        authTag: input.authTag,
      },
    });

    return updated;
  }

  async delete(userId: string, id: string) {
    const existing = await this.prisma.vaultItem.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Vault item not found.');

    await this.prisma.vaultItem.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'VAULT_ITEM_DELETED',
        resourceType: 'VaultItem',
        resourceId: id,
        outcome: 'SUCCESS',
      },
    });

    return { success: true, message: 'Vault item deleted.' };
  }
}
