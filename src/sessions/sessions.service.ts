import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    userId: string;
    deviceId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    const session = await this.prisma.session.create({
      data: {
        userId: params.userId,
        deviceId: params.deviceId,
        refreshToken: params.refreshTokenHash,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        isActive: true,
        expiresAt: params.expiresAt,
      },
      select: { id: true },
    });
    return session.id;
  }

  async rotate(
    sessionId: string,
    newRefreshTokenHash: string,
    newExpiresAt: Date,
  ) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: newRefreshTokenHash,
        expiresAt: newExpiresAt,
        lastActiveAt: new Date(),
      },
    });
  }

  async findActiveById(sessionId: string) {
    return this.prisma.session.findUnique({ where: { id: sessionId } });
  }

  async listUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        deviceId: true,
        ipAddress: true,
        userAgent: true,
        isActive: true,
        createdAt: true,
        lastActiveAt: true,
        expiresAt: true,
      },
    });
  }

  async revoke(userId: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async revokeAll(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    });
  }
}
