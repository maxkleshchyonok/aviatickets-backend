import { Injectable } from '@nestjs/common';
import { RouteDto } from 'api/domain/dto/route.dto';
import { RoutesDto } from 'api/domain/dto/routes.dto';
import { JourneyTypes } from 'api/enums/journey-types.enum';
import { FlightGraphService } from 'api/libs/flight-graph/flight-graph.service';
import { Route } from 'api/types/route.type';
import { GetRoutesQueryDto } from './domain/get-routes-query.dto';

@Injectable()
export class RoutesService {
  constructor(private flightGraph: FlightGraphService) {}

  async findRoutes(query: GetRoutesQueryDto) {
    const { originCity, destinationCity, arrivalTime, passengerAmount } = query;

    let journeyType: JourneyTypes = JourneyTypes.One_way;
    if (arrivalTime) {
      journeyType = JourneyTypes.Round_trip;
    }

    const toDestinationRoutesPromise = this.flightGraph.findRoutes(query);
    let toOriginRoutesPromise = [] as unknown as Promise<Route[]>;

    if (journeyType === JourneyTypes.Round_trip) {
      toOriginRoutesPromise = this.flightGraph.findRoutes({
        originCity: destinationCity,
        destinationCity: originCity,
        departureTime: arrivalTime,
        passengerAmount,
      });
    }

    const [toDestinationRoutes, toOriginRoutes] = await Promise.all([
      toDestinationRoutesPromise,
      toOriginRoutesPromise,
    ]);

    const toDestinationRoutesDto = this.sortRoutesByPrice(
      RouteDto.fromRoutes(toDestinationRoutes),
    );

    const toOriginRoutesDto = this.sortRoutesByPrice(
      RouteDto.fromRoutes(toOriginRoutes),
    );

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
