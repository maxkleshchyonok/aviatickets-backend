import { Injectable } from '@nestjs/common';
import { RouteDto } from 'api/domain/dto/route.dto';
import { RoutesDto } from 'api/domain/dto/routes.dto';
import { FlightGraphService } from 'api/libs/flight-graph/flight-graph.service';
import { GetRoutesQueryDto } from './domain/get-routes-query.dto';

@Injectable()
export class RoutesService {
  constructor(private flightGraph: FlightGraphService) {}

  async findRoutes(query: GetRoutesQueryDto) {
    const toDestinationRoutes = this.flightGraph.findRoutes(
      query.originCity,
      query.destinationCity,
    );

    const toDestinationRoutesDto = RouteDto.fromRoutes(toDestinationRoutes);

    return RoutesDto.fromRoutes(toDestinationRoutesDto);
  }
}
