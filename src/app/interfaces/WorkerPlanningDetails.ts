export interface WorkerPlanningDetails {
    id: number;
    workerPlanningId: number;
    date: Date;
    timeIn: number;
    timeOut: number;
    totalHours: number;
    breakId: number;
    sl: boolean;
    vl: boolean;
    ph: boolean;
    ah: boolean;
    tnr: boolean;
    signature: boolean;
    deleted: boolean;
  }
  