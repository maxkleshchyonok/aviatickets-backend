import { Injectable } from '@nestjs/common';
import { PrismaService } from 'api/libs/prisma/prisma.service';

@Injectable()
export class BookingsRepo {
  constructor(private readonly prisma: PrismaService) {}
}
