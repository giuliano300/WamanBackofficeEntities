import { JobTypes } from "./JobTypes";
import { Workers } from "./Workers";

export interface CompleteWorker {
  worker: Workers;
  jobType: JobTypes;
  trainings: object;
  availability: string;
  workStatus: number;
}
