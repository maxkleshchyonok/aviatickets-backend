import { Route } from 'api/types/route.type';
import { FlightDto } from './flight.dto';
import { v4 } from 'uuid';

export class RouteDto {
  id: string;
  travelTime: number;
  price: number;
  stops: number;
  arrivalTime: number;
  departureTime: number;
  flights: FlightDto[];

  static fromRoute(route?: Route) {
    if (!route.length) {
      return;
    }

    const it = new RouteDto();
    it.id = v4();
    it.flights = FlightDto.fromEntities(route);
    const firstFlight = it.flights.at(0);
    const lastFlight = it.flights.at(-1);
    it.departureTime = firstFlight.departureTime;
    it.arrivalTime = lastFlight.arrivalTime;
    it.travelTime = it.arrivalTime - it.departureTime;
    it.price = route.reduce((prev, flight) => prev + flight.price, 0);
    it.stops = it.flights.length - 1;
    return it;
  }

  static fromRoutes(routes: Route[]) {
    return routes.map((route) => this.fromRoute(route));
  }
}
