import { JourneyTypes } from 'api/enums/journey-types.enum';
import { PaginationQueryDto } from './pagination-query.dto';
import { RouteDto } from './route.dto';
import { TicketDto } from './ticket.dto';

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
