import { WamEntities } from "./Entities";
import { Locations } from "./Locations";
import { WorkerPlannings } from "./WorkerPlannings";
import { WorkingHours } from "./WorkingHours";

export interface CompletePlanning {
    planning: WorkerPlannings;
    location: Locations;
    entity: WamEntities;
    startTime: WorkingHours;
    endTime: WorkingHours;
    workMonth: string;
  }
  