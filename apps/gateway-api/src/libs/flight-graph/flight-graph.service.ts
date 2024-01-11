import { Injectable } from '@nestjs/common';
import { Flight } from '@prisma/client';
import { Route } from 'api/types/route.type';

interface FindRouteOptions {
  originCity: string;
  destinationCity: string;
  departureTime: Date;
}

@Injectable()
export class FlightGraphService {
  vertices: Map<Flight, Flight[]>;

  constructor() {
    this.vertices = new Map<Flight, Flight[]>();
  }

  buildGraph(flights: Flight[]) {
    const vertices = this.vertices;

    this.addVertices(flights);

    vertices.forEach((value, vertex) => {
      const appropriateFlights = flights.filter(
        (flight) => flight.originCity === vertex.destinationCity,
      );
      this.addEdges(vertex, appropriateFlights);
    });
  }

  addVertices(vertices: Flight[]) {
    vertices.forEach((vertex) => this.addVertex(vertex));
  }

  addVertex(vertex: Flight) {
    if (!this.vertices.get(vertex)) {
      this.vertices.set(vertex, []);
    }
  }

  addEdges(vertex1: Flight, vertices: Flight[]) {
    vertices.forEach((vertex) => this.addEdge(vertex1, vertex));
  }

  addEdge(vertex1: Flight, vertex2: Flight) {
    this.vertices.get(vertex1).push(vertex2);
  }

  findRoutes(options: FindRouteOptions) {
    const { originCity, destinationCity, departureTime } = options;
    const routes: Route[] = [];
    const visited = new Set<string>();

    const flightVertices = Array.from<Flight>(this.vertices.keys());

    function dfs(city: string, route: Flight[], arrivalTime: Date) {
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
      (flight) =>
        flight.originCity === originCity &&
        flight.departureTime.toLocaleDateString() ===
          departureTime.toLocaleDateString(),
    );

    for (const flight of flightsFromOriginCity) {
      dfs(flight.destinationCity, [flight], flight.arrivalTime);
    }

    return routes;
  }
}
