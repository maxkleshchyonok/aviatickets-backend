import { Cities } from '@prisma/client';
import { JourneyTypes } from 'api/enums/journey-types.enum';
import { RouteDto } from './route.dto';

class TwoWayRouteDto {
  price: number;
  originCity: Cities;
  destinationCity: Cities;
  toDestinationRoute: RouteDto;
  toOriginRoute: RouteDto | null;

  static toTwoWayRoute(
    toDestinationRoute: RouteDto,
    toOriginRoute: RouteDto | null = null,
  ) {
    const it = new TwoWayRouteDto();
    const firstFlight = toDestinationRoute.flights.at(0);
    const lastFlight = toDestinationRoute.flights.at(-1);
    it.originCity = firstFlight.originCity;
    it.destinationCity = lastFlight.destinationCity;
    it.toDestinationRoute = toDestinationRoute;
    it.toOriginRoute = toOriginRoute;
    it.price =
      toDestinationRoute.price + (toOriginRoute ? toOriginRoute.price : 0);

    return it;
  }

  static fromRoutes(
    toDestinationRoutes: RouteDto[],
    toOriginRoutes: RouteDto[] = [],
  ) {
    const areThereOriginRoutes = Boolean(toOriginRoutes.length);

    if (!toDestinationRoutes.length) {
      return [];
    }

    const routes = toDestinationRoutes
      .map((toDestinationRoute) => {
        if (areThereOriginRoutes) {
          return toOriginRoutes.map((toOriginRoute) =>
            this.toTwoWayRoute(toDestinationRoute, toOriginRoute),
          );
        }
        return this.toTwoWayRoute(toDestinationRoute) as TwoWayRouteDto;
      })
      .flat(1);

    return routes;
  }
}

export class RoutesDto {
  count: number;
  routes: TwoWayRouteDto[];

  static fromRoutes(
    toDestinationRoutes: RouteDto[],
    toOriginRoutes: RouteDto[] = [],
    journeyType: JourneyTypes,
  ) {
    const toDestinationRouteAmount = toDestinationRoutes.length;
    const toOriginRouteAmount = toOriginRoutes.length;

    const oneOfRouteArraysIsEmpty =
      !toDestinationRouteAmount || !toOriginRouteAmount;

    if (
      (journeyType === JourneyTypes.Round_trip && oneOfRouteArraysIsEmpty) ||
      (journeyType === JourneyTypes.One_way && !toDestinationRouteAmount)
    ) {
      const it = new RoutesDto();
      it.count = 0;
      it.routes = [];
      return it;
    }

    if (journeyType === JourneyTypes.One_way) {
      const it = new RoutesDto();
      it.count = toDestinationRouteAmount;
      it.routes = TwoWayRouteDto.fromRoutes(toDestinationRoutes);
      return it;
    }

    const it = new RoutesDto();
    it.count = toDestinationRouteAmount * toOriginRouteAmount;
    it.routes = TwoWayRouteDto.fromRoutes(toDestinationRoutes, toOriginRoutes);
    return it;
  }
}
