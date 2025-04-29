import { CompleteWp } from "./CompleteWp";
import { JobTypes } from "./JobTypes";
import { Workers } from "./Workers";

export interface CompleteWorkerPlanning {
  worker: Workers;
  jobType: JobTypes;
  trainings: object;
  completeWp : CompleteWp[];
}
