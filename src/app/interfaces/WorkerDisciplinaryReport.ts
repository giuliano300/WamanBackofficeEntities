export interface WorkerDisciplinaryReports {
  id: number;
  insertDate: Date;
  locationId: number;
  workerId: number;
  disciplinaryAction: string;
  actionsTaken: string;
  reason: string;
  deleted: boolean;
}
