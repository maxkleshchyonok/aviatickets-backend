import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'api/app/auth/auth.module';
import appConfig from 'api/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [appConfig],
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
