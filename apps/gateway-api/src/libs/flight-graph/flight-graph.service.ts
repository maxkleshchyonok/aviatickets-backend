import { Injectable } from '@nestjs/common';
import { Flight } from '@prisma/client';
import { Route } from 'api/types/route.type';

@Injectable()
export class FlightGraphService {
  vertices: Map<Flight, Flight[]>;

  constructor() {
    this.vertices = new Map<Flight, Flight[]>();
  }

  addVertex(vertex: Flight) {
    if (!this.vertices.get(vertex)) {
      this.vertices.set(vertex, []);
    }
  }

  addEdge(vertex1: Flight, vertex2: Flight) {
    this.vertices.get(vertex1).push(vertex2);
  }

  findRoutes(originCity, destinationCity) {
    const routes: Route[] = [];
    const visited = new Set();

    const flightVertices = Array.from<Flight>(this.vertices.keys());

    function dfs(city, route, arrivalTime) {
      visited.add(city);

      if (city === destinationCity) {
        routes.push(route.slice());
      } else {
        const flightsFromCurrentCity = flightVertices.filter(
          (flight) => flight.originCity === city,
        );

        for (const flight of flightsFromCurrentCity) {
          if (
            !visited.has(flight.destinationCity) &&
            flight.departureTime >= arrivalTime
          ) {
            const newRoute = route.slice();
            newRoute.push(flight);
            dfs(flight.destinationCity, newRoute, flight.arrivalTime);
          }
        }
      }

      visited.delete(city);
    }

    const flightsFromOriginCity = flightVertices.filter(
      (flight) => flight.originCity === originCity,
    );

    for (const flight of flightsFromOriginCity) {
      dfs(flight.destinationCity, [flight], flight.arrivalTime);
    }

    return routes;
  }
}
