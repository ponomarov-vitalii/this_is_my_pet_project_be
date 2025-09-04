// import { Test, TestingModule } from '@nestjs/testing';
// import { SessionsService } from '../sessions/sessions.service';
// import { PrismaService } from '../prisma/prisma.service';

// const prisma = {
//   session: {
//     create: jest.fn(),
//     update: jest.fn(),
//     findUnique: jest.fn(),
//     findMany: jest.fn(),
//     updateMany: jest.fn(),
//   },
// };

// describe('SessionsService', () => {
//   let service: SessionsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SessionsService,
//         { provide: PrismaService, useValue: prisma },
//       ],
//     }).compile();
//     service = module.get(SessionsService);
//   });

//   it('creates session and returns id', async () => {
//     prisma.session.create.mockResolvedValue({ id: 's1' });
//     const id = await service.create({
//       userId: 'u1',
//       deviceId: 'd1',
//       refreshTokenHash: 'h',
//       expiresAt: new Date(),
//     });
//     expect(id).toBe('s1');
//   });

//   it('lists sessions', async () => {
//     prisma.session.findMany.mockResolvedValue([{ id: 's1' }]);
//     const list = await service.listUserSessions('u1');
//     expect(list).toEqual([{ id: 's1' }]);
//   });
// });
