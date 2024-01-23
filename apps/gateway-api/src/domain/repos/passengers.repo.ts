import { Injectable } from '@nestjs/common';
import { Passenger } from '@prisma/client';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class PassengersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByPassport(passenger: Pick<Passenger, 'passportId'>) {
    return await this.prisma.passenger.findUnique({
      where: {
        passportId: passenger.passportId,
      },
    });
  }

  async createPassenger(
    passenger: Pick<Passenger, 'lastName' | 'firstName' | 'passportId'>,
  ) {
    return await this.prisma.passenger.create({
      data: {
        ...passenger,
      },
    });
  }
}
