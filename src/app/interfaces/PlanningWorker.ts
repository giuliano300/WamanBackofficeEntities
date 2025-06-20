import { JobTypes } from "./JobTypes";
import { WorkerPlannings } from "./WorkerPlannings";
import { Workers } from "./Workers";

export interface PlanningWorker {
  planning: WorkerPlannings;
  worker: Workers;
  jobType: JobTypes;
}