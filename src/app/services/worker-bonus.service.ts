import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompleteWorkerBonus } from '../interfaces/CompleteWorkerBonus';
import { WorkerBonus } from '../interfaces/WorkerBonus';

@Injectable({
  providedIn: 'root'
})
export class WorkerBonusService {

  private apiUrl = API_URL + "WorkerBonus";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkerBonus(month?: number, year?: number, workerId?: number, locationId?: number, entityId?: number): Observable<CompleteWorkerBonus[]> {
    return this.http.get<CompleteWorkerBonus[]>(this.apiUrl + "?month=" + month + "&year=" + year + "&workerId=" + workerId + "&locationId=" + locationId + 
      "&entityId=" + entityId);
  }

  getWorkerBonusId(id: string): Observable<CompleteWorkerBonus> {
    return this.http.get<CompleteWorkerBonus>(this.apiUrl + "/" + id);
  }

  setWorkerBonus(w: WorkerBonus): Observable<WorkerBonus> {
    return this.http.post<WorkerBonus>(this.apiUrl + "/New", w);
  }

  updateWorkerBonus(w: WorkerBonus):Observable<boolean>{
    return this.http.post<boolean>(this.apiUrl + "/Update/" + w.id, w);
  }

  deleteWorkerBonus(w: WorkerBonus):Observable<boolean>{
    return this.http.get<boolean>(this.apiUrl + "/Delete/" + w.id);
  }
  
}
