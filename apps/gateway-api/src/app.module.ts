import { Module } from '@nestjs/common';
import { AuthController } from './app/auth/auth.controller';

@Module({
  controllers: [AuthController],
})
export class AppModule {}
