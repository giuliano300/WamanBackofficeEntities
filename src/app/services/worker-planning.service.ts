import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteWorkerPlanning } from '../interfaces/CompleteWorkerPlanning';
import { Observable } from 'rxjs';
import { PlanningWorker } from '../interfaces/PlanningWorker';

@Injectable({
  providedIn: 'root'
})
export class WoerkerPlanningService {

  private apiUrl = API_URL + "WorkerPlannings";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkerPlanning(workerId: number, year: number, locationId?: number, entityId?: number): Observable<CompleteWorkerPlanning> {
    return this.http.get<CompleteWorkerPlanning>(this.apiUrl + "/CompletePlannings?workerId=" + workerId + "&year=" + year + "&locationId=" + locationId + "&entityId=" + entityId);
  }
  // Metodo per ottenere le location
  getWorkersPlanning(month: number, year: number, locationId?: number, jobType?: number): Observable<PlanningWorker[]> {
    return this.http.get<PlanningWorker[]>(this.apiUrl + "/CompletePlanningsByMonthYear?month=" + month + "&year=" + year + "&locationId=" + locationId + "&jobType=" + jobType);
  }
}
