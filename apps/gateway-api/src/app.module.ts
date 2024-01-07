import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'api/app/auth/auth.module';
import appConfig from 'api/config/app.config';
import securityConfig from 'api/config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [appConfig, securityConfig],
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
