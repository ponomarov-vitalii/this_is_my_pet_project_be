// import { Test, TestingModule } from '@nestjs/testing';
// import { Prisma, User } from '@prisma/client';
// import { PasswordService } from 'src/common/services/password.service';
// import { UsersService } from './users.service';
// import { PrismaService } from 'src/prisma/prisma.service';

// class PrismaServiceMock {
//   user = {
//     create: jest.fn<Promise<User>, [Prisma.UserCreateArgs]>(),
//     findUnique: jest.fn<Promise<User | null>, [Prisma.UserFindUniqueArgs]>(),
//     findMany: jest.fn<Promise<User[]>, [Prisma.UserFindManyArgs]>(),
//     count: jest.fn<Promise<number>, [Prisma.UserCountArgs | undefined]>(),
//     update: jest.fn<Promise<User>, [Prisma.UserUpdateArgs]>(),
//   };
//   $transaction = jest.fn(
//     async <T>(
//       cbs:
//         | Array<Promise<T>>
//         | [(...args: never[]) => Promise<T>, (...args: never[]) => Promise<T>],
//     ) => {
//       if (Array.isArray(cbs)) return Promise.all(cbs) as unknown as T[];
//       return [] as unknown as T[];
//     },
//   );
// }

// describe('UsersService', () => {
//   let service: UsersService;
//   let prisma: PrismaServiceMock;
//   let passwordService: PasswordService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         PasswordService,
//         { provide: PrismaService, useClass: PrismaServiceMock },
//       ],
//     }).compile();

//     service = module.get(UsersService);
//     prisma = module.get(PrismaService);
//     passwordService = module.get(PasswordService);
//   });

//   it('hashes password and creates user with lowered email', async () => {
//     const plain = 'Password123';
//     const hashed = await passwordService.hash(plain);

//     const created: User = {
//       id: 'u_1',
//       email: 'test@example.com',
//       username: null,
//       password: hashed,
//       firstName: null,
//       lastName: null,
//       avatar: null,
//       role: 'USER',
//       status: 'PENDING_VERIFICATION',
//       emailVerified: false,
//       emailVerifiedAt: null,
//       lastLoginAt: null,
//       lastActiveAt: null,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     prisma.user.create.mockResolvedValue(created);

//     const result = await service.create({
//       email: 'Test@Example.com',
//       password: plain,
//     });

//     expect(prisma.user.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: expect.objectContaining({ email: 'test@example.com' }),
//       }),
//     );
//     expect(result).toMatchObject({ id: 'u_1', email: 'test@example.com' });
//     // Must not expose password
//     // @ts-expect-error password should not exist on SafeUser
//     expect(result.password).toBeUndefined();
//   });

//   it('throws ConflictException on unique violation', async () => {
//     prisma.user.create.mockRejectedValue({ code: 'P2002' });
//     await expect(
//       service.create({ email: 'dup@example.com', password: 'Password123' }),
//     ).rejects.toThrow('Email or username already in use');
//   });

//   it('returns paginated list', async () => {
//     const user: User = {
//       id: 'u_1',
//       email: 'a@a.com',
//       username: null,
//       password: 'hash',
//       firstName: null,
//       lastName: null,
//       avatar: null,
//       role: 'USER',
//       status: 'ACTIVE',
//       emailVerified: false,
//       emailVerifiedAt: null,
//       lastLoginAt: null,
//       lastActiveAt: null,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     prisma.user.findMany.mockResolvedValue([user]);
//     prisma.user.count.mockResolvedValue(1);

//     const result = await service.list(1, 10);
//     expect(result.total).toBe(1);
//     expect(result.data[0]).toMatchObject({ id: 'u_1', email: 'a@a.com' });
//   });
// });
