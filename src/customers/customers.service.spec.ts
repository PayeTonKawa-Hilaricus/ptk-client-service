import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  // Mock par défaut : Tout va bien, le client existe
  const mockPrismaService = {
    customer: {
      create: jest
        .fn()
        .mockReturnValue({ id: 'c1', userId: 'user-123', firstName: 'John' }),
      findMany: jest.fn().mockResolvedValue([{ id: 'c1', firstName: 'John' }]),
      findUnique: jest.fn().mockResolvedValue({ id: 'c1', firstName: 'John' }), // <--- Par défaut, il trouve quelqu'un
      update: jest.fn().mockResolvedValue({ id: 'c1', firstName: 'Updated' }),
      delete: jest.fn().mockResolvedValue({ id: 'c1' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // IMPORTANT : On nettoie les mocks après chaque test pour éviter la pollution
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it("devrait sauvegarder un customer si aucun n'existe", async () => {
      // ICI on force "null" juste pour CE test
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValueOnce(null);

      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '06',
        address: 'Rue',
      };
      await service.create('user-123', dto as any);

      expect(prisma.customer.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devrait retourner une liste', async () => {
      await service.findAll();
      expect(prisma.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un customer existant', async () => {
      // On s'assure que findUnique renvoie bien un objet (comportement par défaut)
      // Pas besoin de spyOn ici car le mock par défaut dans beforeEach est bon
      const result = await service.findOne('c1');
      expect(result).toBeDefined();
      expect(prisma.customer.findUnique).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un customer', async () => {
      if (service.update) {
        // Le service update appelle souvent findOne avant.
        // Comme le mock par défaut renvoie un user, ça va passer.
        await service.update('c1', { firstName: 'Modif' } as any);
        expect(prisma.customer.update).toHaveBeenCalled();
      }
    });
  });

  describe('remove', () => {
    it('devrait supprimer un customer', async () => {
      if (service.remove) {
        await service.remove('c1');
        expect(prisma.customer.delete).toHaveBeenCalled();
      }
    });
  });
});
