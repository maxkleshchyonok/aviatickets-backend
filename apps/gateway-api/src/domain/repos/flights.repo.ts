import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Flight} from "@prisma/client";
import { ErrorMessage } from "api/enums/error-message.enum";
import { PrismaService } from "api/libs/prisma/prisma.service";


@Injectable()
export class FlightsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findManyById(flightId: string) {
    return await this.prisma.flight.findUnique({
        where: {
            id: flightId
        }
    })
  }

  async decreaseSeatAmount(flightIds: string[], amount: number) {
    await this.prisma.$transaction(async (tx) => {
      await tx.flight.updateMany({
        where: {
          id: {in: flightIds}
        },
        data: {
          availableSeatAmount: {
            decrement: amount
          }
        }
      })
      
      const flights = await tx.flight.findMany({
        where: {
          id: {in: flightIds}
        }
      })

      flights.map((flight) => {
        if (flight.availableSeatAmount < 0) {
          return null
        }
      })
    }, {isolationLevel: 'Serializable'})
    return true
  }
}