export interface WorkerIncidentAccidentReports {
id: number;
  workerId: number;
  entityId: number;
  locationId: number;
  date: Date; 
  hour: string;
  place: string;
  description: string;
  observations: string;
  cause: string;
  uploadFiles: string;
  deleted: boolean;

  compilerName: string;
  compilerRole: string;
  compilerIdCardNumber: string;
  emailCompiler: string;
  mobileCompiler: string;
}
