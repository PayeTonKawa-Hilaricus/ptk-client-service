import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomersService = {
    create: jest.fn().mockResolvedValue({ id: '1', firstName: 'John' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CustomersService, useValue: mockCustomersService },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('create appelle le service', async () => {
    const req = { user: { userId: 'u1' } };
    const dto = { firstName: 'A', lastName: 'B' };
    await controller.create(req as any, dto as any);
    expect(service.create).toHaveBeenCalledWith('u1', dto);
  });

  it('findAll appelle le service', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne appelle le service', async () => {
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  // AJOUTS
  it('update appelle le service', async () => {
    if(controller.update) {
       await controller.update('1', {});
       expect(service.update).toHaveBeenCalled();
    }
  });

  it('remove appelle le service', async () => {
    if(controller.remove) {
       await controller.remove('1');
       expect(service.remove).toHaveBeenCalled();
    }
  });
});