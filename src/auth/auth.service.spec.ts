// import { Test, TestingModule } from '@nestjs/testing';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/users.service';
// import { PasswordService } from 'src/common/services/password.service';

// const mockUser = {
//   id: 'u_1',
//   email: 'test@example.com',
//   password: '$argon2$hash',
//   role: 'USER',
// };

// class PrismaMock {
//   session = {
//     create: jest.fn(),
//     findUnique: jest.fn(),
//     update: jest.fn(),
//   };
//   user = {
//     findUnique: jest.fn(),
//   };
// }

// describe('AuthService', () => {
//   let service: AuthService;
//   let prisma: PrismaMock;
//   let usersService: Partial<UsersService>;
//   let passwordService: PasswordService;
//   let jwtService: Partial<JwtService>;
//   let config: Partial<ConfigService>;

//   beforeEach(async () => {
//     prisma = new PrismaMock() as unknown as PrismaMock;
//     usersService = {
//       findByEmail: jest.fn().mockResolvedValue(mockUser as any),
//     };
//     passwordService = new PasswordService();
//     jwtService = {
//       signAsync: jest.fn().mockResolvedValue('access.token'),
//     } as any;
//     config = {
//       get: jest.fn().mockImplementation((k) => {
//         if (k === 'jwt.accessExpiresIn') return '15m';
//         if (k === 'jwt.refreshExpiresIn') return '7d';
//         return null;
//       }),
//     } as any;

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: UsersService, useValue: usersService },
//         { provide: PrismaService, useValue: prisma },
//         { provide: JwtService, useValue: jwtService },
//         { provide: ConfigService, useValue: config },
//         PasswordService,
//       ],
//     }).compile();

//     service = module.get(AuthService);
//   });

//   it('validates credentials correctly', async () => {
//     const ok = await service.validateCredentials(
//       'test@example.com',
//       'Password123',
//     );
//     expect(ok).toBeTruthy();
//   });

//   it('creates session and returns tokens on login', async () => {
//     prisma.session.create.mockResolvedValue({ id: 's_1' });
//     const res = await service.login(
//       'test@example.com',
//       'Password123',
//       null,
//       '127.0.0.1',
//       'ua',
//     );
//     expect(res).toHaveProperty('accessToken');
//     expect(res).toHaveProperty('refreshToken');
//     expect(res).toHaveProperty('sessionId');
//   });
// });
