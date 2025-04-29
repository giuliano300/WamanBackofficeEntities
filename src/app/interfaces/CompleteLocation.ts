import { City } from "./City";
import { Locations } from "./Locations";

export interface CompleteLocation {
  city: City;
  location: Locations;
  timeIn: string;
  timeOut: string;
}
