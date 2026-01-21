import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { PrometheusModule } from '@willsoto/nestjs-prometheus/dist/module';

@Module({
  imports: [
    CustomersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrometheusModule.register(),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
