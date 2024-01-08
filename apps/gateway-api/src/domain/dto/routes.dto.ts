import { Cities } from '@prisma/client';
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
    const flight = toDestinationRoute.flights[0];
    it.originCity = flight.originCity;
    it.destinationCity = flight.destinationCity;
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
      return;
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
  ) {
    const toDestinationRoutesCount = toDestinationRoutes.length;
    const toOriginRoutesCount = toOriginRoutes.length;
    const areThereToOriginRoutes = Boolean(toOriginRoutesCount);

    if (!toDestinationRoutesCount) {
      return;
    }

    const it = new RoutesDto();
    it.count =
      toDestinationRoutesCount *
      (areThereToOriginRoutes ? toOriginRoutesCount : 1);

    it.routes = TwoWayRouteDto.fromRoutes(toDestinationRoutes, toOriginRoutes);
    return it;
  }
}
