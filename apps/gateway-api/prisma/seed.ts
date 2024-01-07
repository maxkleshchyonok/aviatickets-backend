import { faker } from '@faker-js/faker';
import { PrismaClient, Cities, FlightStatuses, Flight } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

type MockFlight = Omit<Flight, 'id' | 'createdAt' | 'updatedAt' | 'planeId'>;

async function createFlights(quantity: number) {
  const cities = Object.values(Cities);
  const flights: MockFlight[] = [];

  for (let i = 0; i < quantity; i++) {
    const departureTime = faker.date.soon({
      days: 60,
      refDate: '2024-01-01T00:00:00.000Z',
    });
    const arrivalTime = new Date(
      departureTime.getTime() + randomInt(1, 15) * 60 * 60 * 1000,
    );

    const temp = cities;
    const originCity = temp.sort(() => 0.5 - Math.random())[0];
    let destinationCity: Cities | null = null;

    do {
      destinationCity = temp.sort(() => 0.5 - Math.random())[0];
    } while (destinationCity === originCity);

    const flight: MockFlight = {
      originCity,
      destinationCity,
      departureTime,
      arrivalTime,
      status: FlightStatuses.Planned,
      price: Math.floor(Math.random() * 1000),
    };

    flights.push(flight);
  }

  await prisma.flight.createMany({ data: flights });
}

async function main() {
  await createFlights(1000);
}

main()
  .catch((e) => console.log(e))
  .finally(async () => {
    prisma.$disconnect;
  });
