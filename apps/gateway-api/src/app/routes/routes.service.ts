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
    const { originCity, destinationCity, arrivalTime, passengerAmount } = query;

    let journeyType: JourneyTypes = JourneyTypes.One_way;
    if (arrivalTime) {
      journeyType = JourneyTypes.Round_trip;
    }

    const toDestinationRoutes = this.flightGraph.findRoutes(query);
    const toDestinationRoutesDto = this.sortRoutesByPrice(
      RouteDto.fromRoutes(toDestinationRoutes),
    );

    let toOriginRoutes = [];
    let toOriginRoutesDto = [];

    if (journeyType === JourneyTypes.Round_trip) {
      toOriginRoutes = this.flightGraph.findRoutes({
        originCity: destinationCity,
        destinationCity: originCity,
        departureTime: arrivalTime,
        passengerAmount,
      });

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
