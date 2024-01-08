import { Injectable } from '@nestjs/common';
import { GetRoutesQueryDto } from './domain/get-routes-query.dto';

@Injectable()
export class RoutesService {
  async findRoutes(query: GetRoutesQueryDto) {}
}
