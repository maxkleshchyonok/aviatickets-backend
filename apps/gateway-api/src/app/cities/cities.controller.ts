import { Controller, Get } from '@nestjs/common';
import { Cities } from '@prisma/client';

@Controller('cities')
export class CitiesController {
  @Get()
  async getAllCities() {
    return Object.values(Cities);
  }
}
