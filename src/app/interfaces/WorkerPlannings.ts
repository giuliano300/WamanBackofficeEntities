export interface WorkerPlannings {
    id: number;
    workerId: number;
    locationId: number;
    startTime: number;
    endTime: number;
    workMonth: number;
    workYear: number;
    breakId: number;
    startWork: Date;
    endWork: Date;
    pathFile: string;
    deleted: boolean;
    sheetSended: boolean;
    sendSignatureSheet: string;
  }
  