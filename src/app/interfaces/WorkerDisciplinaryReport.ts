export interface WorkerDisciplinaryReports {
  id: number;
  insertDate: Date;
  locationId: number;
  entityId: number;
  workerId: number;
  disciplinaryAction?: string;
  actionsTaken?: string;
  reason?: string;
  uploadFiles?: string;
  deleted: boolean;
}
