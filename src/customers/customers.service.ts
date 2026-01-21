import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCustomerDto: CreateCustomerDto) {
    // 1. Vérifier si ce user a déjà une fiche client
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'Une fiche client existe déjà pour cet utilisateur.',
      );
    }

    // 2. Créer la fiche avec MAPPING EXPLICITE (Correction de ton erreur TS)
    return this.prisma.customer.create({
      data: {
        userId: userId,
        firstName: createCustomerDto.firstName,
        lastName: createCustomerDto.lastName,
        phone: createCustomerDto.phone,
        address: createCustomerDto.address,
      },
    });
  }

  async findAll() {
    return this.prisma.customer.findMany();
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException(`Client #${id} introuvable`);
    return customer;
  }

  async findByUserId(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer)
      throw new NotFoundException(
        `Aucun profil client associé à cet utilisateur`,
      );
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
