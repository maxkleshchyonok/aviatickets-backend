import { Controller, Get, Query } from '@nestjs/common';
import { GetRoutesQueryDto } from './domain/get-routes-query.dto';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  async getRoutes(@Query() query: GetRoutesQueryDto) {
    const routes = await this.routesService.findRoutes(query);
    return routes;
  }
}
