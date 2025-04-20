export type FlightLeg = {
  DepartureAirport: string;
  ArrivalAirport: string;
  DepartureTime: string;
  ArrivalTime: string;
  FlightNumber: string;
  AirlineName: string;
  AircraftType: string;
};

export type FlightDeal = {
  TravelClass: string;
  Origin: string;
  OriginAirportName: string;
  OriginCityName: string;
  OriginCountry: string;
  OriginTimeZone: string;
  Destination: string;
  DestinationAirportName: string;
  DestinationCityName: string;
  DestinationCountry: string;
  DestinationTimeZone: string;
  IsDirect: boolean;
  DepartureTime: string;
  ArrivalTime: string;
  TotalTravelTimeMinutes: string;
  FlightNumbers: string[];
  BaggageAmount: string;
  BaggageType: string;
  Cost: string;
  CostFloat: number;
  PurchasingId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connections: any[];
  Legs: FlightLeg[];
  CostBelowAverage: number;
  PercentBelowAverage: number;
  SeatsAvailable: number;
};
