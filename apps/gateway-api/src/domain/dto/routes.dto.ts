import { JourneyTypes } from 'api/enums/journey-types.enum';
import { PaginationQueryDto } from './pagination-query.dto';
import { RouteDto } from './route.dto';
import { v4 } from 'uuid';

class TwoWayRouteDto {
  id: string;
  price: number;
  toDestinationRoute: RouteDto;
  toOriginRoute: RouteDto | null;

  static toTwoWayRoute(
    toDestinationRoute: RouteDto,
    toOriginRoute: RouteDto | null = null,
  ) {
    const it = new TwoWayRouteDto();
    it.id = v4();
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
    paginationOptions: PaginationQueryDto,
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
      const routes = TwoWayRouteDto.fromRoutes(toDestinationRoutes);
      it.routes = paginateArray(routes, paginationOptions);
      return it;
    }

    const it = new RoutesDto();
    it.count = toDestinationRouteAmount * toOriginRouteAmount;
    const routes = TwoWayRouteDto.fromRoutes(
      toDestinationRoutes,
      toOriginRoutes,
    );
    it.routes = paginateArray(routes, paginationOptions);

    return it;
  }
}

const paginateArray = (array: any[], paginationOptions: PaginationQueryDto) => {
  const { pageNumber, pageSize } = paginationOptions;
  const arrayChunk = array.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );
  return arrayChunk;
};
