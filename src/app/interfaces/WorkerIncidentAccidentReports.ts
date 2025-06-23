export interface WorkerIncidentAccidentReports {
  id: number;
  workerId: number;
  entityId: number;
  locationId: number;
  date: Date;
  place: string;
  deleted: boolean;
}
