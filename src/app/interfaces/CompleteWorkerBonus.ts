import { WamEntities } from "./Entities";
import { Locations } from "./Locations";
import { WorkerBonus } from "./WorkerBonus";
import { Workers } from "./Workers";

export interface CompleteWorkerBonus {
  worker: Workers;
  entity: WamEntities;
  location: Locations;
  workerBonus : WorkerBonus;
}
