import { JourneyTypes } from 'api/enums/journey-types.enum';
import { PaginationQueryDto } from './pagination-query.dto';
import { RouteDto } from './route.dto';
import { v4 } from 'uuid';

class TicketDto {
  id: string;
  price: number;
  toDestinationRoute: RouteDto;
  toOriginRoute: RouteDto | null;

  static toTwoWayRoute(
    toDestinationRoute: RouteDto,
    toOriginRoute: RouteDto | null = null,
  ) {
    const it = new TicketDto();
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

    const tickets = toDestinationRoutes
      .map((toDestinationRoute) => {
        if (areThereOriginRoutes) {
          return toOriginRoutes.map((toOriginRoute) =>
            this.toTwoWayRoute(toDestinationRoute, toOriginRoute),
          );
        }
        return this.toTwoWayRoute(toDestinationRoute) as TicketDto;
      })
      .flat(1);

    return tickets;
  }
}

export class TicketsDto {
  count: number;
  tickets: TicketDto[];

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
      const it = new TicketsDto();
      it.count = 0;
      it.tickets = [];
      return it;
    }

    if (journeyType === JourneyTypes.One_way) {
      const it = new TicketsDto();
      it.count = toDestinationRouteAmount;
      const tickets = TicketDto.fromRoutes(toDestinationRoutes);
      it.tickets = paginateArray(tickets, paginationOptions);
      return it;
    }

    const it = new TicketsDto();
    it.count = toDestinationRouteAmount * toOriginRouteAmount;
    const tickets = TicketDto.fromRoutes(toDestinationRoutes, toOriginRoutes);
    it.tickets = paginateArray(tickets, paginationOptions);

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
