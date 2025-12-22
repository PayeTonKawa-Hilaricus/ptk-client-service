import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    CustomersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
