import { Injectable } from '@nestjs/common';
import { RouteDto } from 'api/domain/dto/route.dto';
import { RoutesDto } from 'api/domain/dto/routes.dto';
import { JourneyTypes } from 'api/enums/journey-types.enum';
import { FlightGraphService } from 'api/libs/flight-graph/flight-graph.service';
import { GetRoutesQueryDto } from './domain/get-routes-query.dto';

@Injectable()
export class RoutesService {
  constructor(private flightGraph: FlightGraphService) {}

  findRoutes(query: GetRoutesQueryDto) {
    const toDestinationRoutes = this.flightGraph.findRoutes(
      query.originCity,
      query.destinationCity,
      query.departureDate,
    );

    let journeyType: JourneyTypes = JourneyTypes.One_way;

    if (query.arrivalDate) {
      journeyType = JourneyTypes.Round_trip;
    }

    const toDestinationRoutesDto = this.sortRoutesByPrice(
      RouteDto.fromRoutes(toDestinationRoutes),
    );

    let toOriginRoutes = [];
    let toOriginRoutesDto = [];

    if (journeyType === JourneyTypes.Round_trip) {
      toOriginRoutes = this.flightGraph.findRoutes(
        query.destinationCity,
        query.originCity,
        query.arrivalDate,
      );

      toOriginRoutesDto = this.sortRoutesByPrice(
        RouteDto.fromRoutes(toOriginRoutes),
      );
    }

    return RoutesDto.fromRoutes(
      toDestinationRoutesDto,
      toOriginRoutesDto,
      journeyType,
    );
  }

  private sortRoutesByPrice(routes: RouteDto[]) {
    return routes.sort((flight1, flight2) => flight1.price - flight2.price);
  }
}
