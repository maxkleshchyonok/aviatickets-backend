import { v4 } from 'uuid';
import { RouteDto } from './route.dto';

export class TicketDto {
  id: string;
  price: number;
  toDestinationRoute: RouteDto;
  toOriginRoute: RouteDto | null;

  static toTicket(
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
            this.toTicket(toDestinationRoute, toOriginRoute),
          );
        }
        return this.toTicket(toDestinationRoute) as TicketDto;
      })
      .flat(1);

    return tickets;
  }
}
