export interface WorkerIncidentAccidentReports {
  id: number;
  workerId: number;
  entityId: number;
  locationId: number;
  date: Date;
  place?: string;
  uploadFiles?: string;
  description?: string;
  deleted: boolean;
}
