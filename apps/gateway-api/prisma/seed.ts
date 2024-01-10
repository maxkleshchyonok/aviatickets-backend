import { faker } from '@faker-js/faker';
import { PrismaClient, Cities, FlightStatuses, Flight } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

type MockFlight = Omit<Flight, 'id' | 'createdAt' | 'updatedAt' | 'planeId'>;

function getRandomInt(leftBoundary: number, rightBoundary: number): number {
  const min = Math.ceil(leftBoundary);
  const max = Math.floor(rightBoundary);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createFlights(quantity: number) {
  const cities = Object.values(Cities);
  const flights: MockFlight[] = [];

  for (let i = 0; i < quantity; i++) {
    const departureTime = faker.date.soon({
      days: 60,
      refDate: '2024-01-15T00:00:00.000Z',
    });

    const arrivalTime = new Date(
      departureTime.getTime() + randomInt(1, 15) * 60 * 60 * 1000,
    );

    const originCityIndex = getRandomInt(0, cities.length - 1);
    let destinationCityIndex = getRandomInt(0, cities.length - 1);

    do {
      destinationCityIndex = getRandomInt(0, cities.length - 1);
    } while (destinationCityIndex === originCityIndex);

    const price = getRandomInt(10, 1000);
    const seatAmount = getRandomInt(10, 350);
    const availableSeatAmount = getRandomInt(1, seatAmount);

    const flight: MockFlight = {
      originCity: cities[originCityIndex],
      destinationCity: cities[destinationCityIndex],
      departureTime,
      arrivalTime,
      status: FlightStatuses.Planned,
      price,
      seatAmount,
      availableSeatAmount,
    };

    flights.push(flight);
  }

  await prisma.flight.createMany({ data: flights });
}

async function main() {
  await createFlights(400);
}

main()
  .catch((e) => console.log(e))
  .finally(async () => {
    prisma.$disconnect;
  });
