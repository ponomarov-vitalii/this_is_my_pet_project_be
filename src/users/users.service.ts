import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  private toSafe(user: User): SafeUser {
    // Remove password before returning outward
    const { password: _, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const email = dto.email.trim().toLowerCase();

    // Ensure unique constraints are handled gracefully
    try {
      const hashed = await this.passwordService.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashed,
          firstName: dto.firstName?.trim(),
          lastName: dto.lastName?.trim(),
          username: dto.username?.trim(),
          status: 'PENDING_VERIFICATION',
          emailVerified: false,
        },
      });

      return this.toSafe(user);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Email or username already in use');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toSafe(user);
  }

  async findByEmail(rawEmail: string): Promise<User | null> {
    const email = rawEmail.trim().toLowerCase();
    return this.prisma.user.findUnique({ where: { email } });
  }

  async list(
    page = 1,
    perPage = 20,
  ): Promise<{
    data: SafeUser[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const skip = (page - 1) * perPage;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: items.map((u) => this.toSafe(u)),
      total,
      page,
      perPage,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: dto.firstName?.trim(),
          lastName: dto.lastName?.trim(),
          username: dto.username?.trim(),
        },
      });
      return this.toSafe(user);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Username already in use');
      }
      if (this.isNotFound(error)) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  private isUniqueConstraintError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (
      Boolean(error) &&
      typeof error === 'object' &&
      'code' in (error as Record<string, unknown>) &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
    );
  }

  private isNotFound(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (
      Boolean(error) &&
      typeof error === 'object' &&
      'code' in (error as Record<string, unknown>) &&
      (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
    );
  }
}
