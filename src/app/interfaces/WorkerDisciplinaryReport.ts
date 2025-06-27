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

  compilerName: string;
  compilerRole: string;
  compilerIdCardNumber: string;
  emailCompiler: string;
  mobileCompiler: string;
}
