import { Locations } from "./Locations";
import { WorkerDisciplinaryReports } from "./WorkerDisciplinaryReport";
import { Workers } from "./Workers";

export interface CompleteWorkerDisciplinaryReports {
  worker: Workers;
  location: Locations;
  workerDisciplinaryReport : WorkerDisciplinaryReports;
}
