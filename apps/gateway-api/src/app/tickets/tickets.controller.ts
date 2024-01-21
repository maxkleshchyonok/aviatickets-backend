import { Controller, Get, Query } from '@nestjs/common';
import { TicketsDto } from 'api/domain/dto/tickets.dto';
import { GetTicketsQueryDto } from './domain/get-tickets-query.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getAllTickets(@Query() query: GetTicketsQueryDto) {
    const routes = await this.ticketsService.findRoutes(query);
    return TicketsDto.fromRoutes(
      routes.toDestinationRoutesDto,
      routes.toOriginRoutesDto,
      routes.journeyType,
      query,
    );
  }
}
