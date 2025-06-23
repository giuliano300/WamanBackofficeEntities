import { WamEntities } from "./Entities";
import { Locations } from "./Locations";
import { WorkerIncidentAccidentReports } from "./WorkerIncidentAccidentReports";
import { Workers } from "./Workers";

export interface CompleteWorkerIncidentAccidentReports {
  worker: Workers;
  location: Locations;
  entity: WamEntities;
  workerIncidentAccidentReport : WorkerIncidentAccidentReports;
}
