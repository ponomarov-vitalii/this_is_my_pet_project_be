import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../common/services/password.service';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';
import * as crypto from 'crypto';

export interface JwtPayload {
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  private accessTokenTtl: string;
  private refreshTokenTtl: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly config: ConfigService,
  ) {
    this.accessTokenTtl =
      this.config.get<string>('jwt.accessExpiresIn') || '15m';
    this.refreshTokenTtl =
      this.config.get<string>('jwt.refreshExpiresIn') || '7d';
  }

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseDurationMs(str: string) {
    if (/^\d+m$/.test(str))
      return parseInt(str.replace('m', ''), 10) * 60 * 1000;
    if (/^\d+h$/.test(str))
      return parseInt(str.replace('h', ''), 10) * 60 * 60 * 1000;
    if (/^\d+d$/.test(str))
      return parseInt(str.replace('d', ''), 10) * 24 * 60 * 60 * 1000;
    if (/^\d+s$/.test(str)) return parseInt(str.replace('s', ''), 10) * 1000;
    return 7 * 24 * 60 * 60 * 1000;
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;
    const ok = await this.passwordService.verify(user.password, password);
    if (!ok) return null;
    return user;
  }

  async login(
    email: string,
    password: string,
    deviceId: string | null,
    ip?: string,
    userAgent?: string,
  ) {
    const user = await this.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenTtl,
    });

    const refreshPlain = crypto.randomBytes(64).toString('hex');
    const refreshHash = this.hashToken(refreshPlain);
    const expiresAt = new Date(
      Date.now() + this.parseDurationMs(this.refreshTokenTtl),
    );

    const newDeviceId = deviceId ?? crypto.randomUUID();
    const sessionId = await this.sessionsService.create({
      userId: user.id,
      deviceId: newDeviceId,
      refreshTokenHash: refreshHash,
      ipAddress: ip,
      userAgent,
      expiresAt,
    });

    return { accessToken, refreshToken: refreshPlain, sessionId };
  }

  async refresh(sessionId: string, providedToken: string) {
    const session = await this.sessionsService.findActiveById(sessionId);
    if (!session || !session.isActive)
      throw new UnauthorizedException('Invalid session');

    const providedHash = this.hashToken(providedToken);
    if (providedHash !== session.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');
    if (session.expiresAt.getTime() < Date.now())
      throw new UnauthorizedException('Refresh expired');

    const user = await this.usersService.findById(session.userId);
    if (!user) throw new UnauthorizedException('User not found');

    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenTtl,
    });

    const newRefreshPlain = crypto.randomBytes(64).toString('hex');
    const newRefreshHash = this.hashToken(newRefreshPlain);
    const newExpiresAt = new Date(
      Date.now() + this.parseDurationMs(this.refreshTokenTtl),
    );
    await this.sessionsService.rotate(sessionId, newRefreshHash, newExpiresAt);

    return { accessToken, refreshToken: newRefreshPlain };
  }

  async logout(sessionId: string) {
    const session = await this.sessionsService.findActiveById(sessionId);
    if (!session) return;
    await this.sessionsService.revoke(session.userId, sessionId);
  }
}
