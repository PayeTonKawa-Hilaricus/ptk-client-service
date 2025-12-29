import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // Route protégée : Créer ma fiche client
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createCustomerDto: CreateCustomerDto) {
    // req.user contient le payload du token (userId, email...)
    return this.customersService.create(req.user.userId, createCustomerDto);
  }

  // Route protégée : Voir MON profil
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyProfile(@Request() req) {
    return this.customersService.findByUserId(req.user.userId);
  }

  // Route protégée : Voir tous les clients (Idéalement réservé ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.customersService.findAll();
  }
  // Route protégée : Voir un client par son ID (Idéalement réservé ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
  // Route protégée : Mettre à jour ma fiche client
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }
  // Route protégée : Supprimer un client par son ID (Idéalement réservé ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
