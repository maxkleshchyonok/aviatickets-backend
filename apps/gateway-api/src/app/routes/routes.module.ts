import { Module } from '@nestjs/common';
import { FlightGraphModule } from 'api/libs/flight-graph/flight-graph.module';
import { PrismaModule } from 'api/libs/prisma/prisma.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [PrismaModule, FlightGraphModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
