import { Module } from '@nestjs/common';
import { PrismaModule } from 'api/libs/prisma/prisma.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
