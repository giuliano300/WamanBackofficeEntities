import { CompletePlanning } from "./CompletePlanning";
import { WorkerPlanningDetails } from "./WorkerPlanningDetails";

export interface CompleteWp {
  completePlanning: CompletePlanning;
  completeWp: WorkerPlanningDetails[];
  breakName: string;
}
