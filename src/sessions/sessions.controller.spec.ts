// import { Test, TestingModule } from '@nestjs/testing';
// import { SessionsController } from './sessions.controller';
// import { SessionsService } from './sessions.service';

// const service = {
//   listUserSessions: jest.fn(),
//   revoke: jest.fn(),
//   revokeAll: jest.fn(),
// };

// describe('SessionsController', () => {
//   let controller: SessionsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [SessionsController],
//       providers: [{ provide: SessionsService, useValue: service }],
//     }).compile();

//     controller = module.get(SessionsController);
//   });

//   it('lists sessions', async () => {
//     service.listUserSessions.mockResolvedValue([{ id: 's1' }]);
//     const res = await controller.list({ userId: 'u1', role: 'USER' });
//     expect(res).toEqual([{ id: 's1' }]);
//   });
// });
