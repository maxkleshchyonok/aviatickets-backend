import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'api/app/auth/auth.module';
import appConfig from 'api/config/app.config';
import securityConfig from 'api/config/security.config';
import { TicketsModule } from 'api/app/tickets/tickets.module';
import { UsersModule } from 'api/app/users/users.module';
import { BookingsModule } from './app/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [appConfig, securityConfig],
      isGlobal: true,
    }),
    AuthModule,
    TicketsModule,
    UsersModule,
    BookingsModule,
  ],
})
export class AppModule {}
