import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteWorkerDisciplinaryReports } from '../interfaces/CompleteWorkerDisciplinaryReports';
import { Observable } from 'rxjs';
import { WorkerDisciplinaryReports } from '../interfaces/WorkerDisciplinaryReport';

@Injectable({
  providedIn: 'root'
})
export class WorkerDisciplinaryReportsService {

  private apiUrl = API_URL + "WorkerDisciplinaryReports";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkerDisciplinaryReports(month?: number, year?: number, workerId?: number, locationId?: number, entityId?: number): Observable<CompleteWorkerDisciplinaryReports[]> {
    return this.http.get<CompleteWorkerDisciplinaryReports[]>(this.apiUrl + "?workerId=" + workerId + "&year=" + year + "&month=" + month + "&locationId=" + locationId + "&entityId=" + entityId);
  }

  getWorkerDisciplinaryReport(id: string): Observable<CompleteWorkerDisciplinaryReports> {
    return this.http.get<CompleteWorkerDisciplinaryReports>(this.apiUrl + "/" + id);
  }

  setWorkerDisciplinaryReport(w: WorkerDisciplinaryReports):Observable<WorkerDisciplinaryReports>{
    return this.http.post<WorkerDisciplinaryReports>(this.apiUrl + "/New", w);
  }

  updateWorkerDisciplinaryReport(w: WorkerDisciplinaryReports):Observable<boolean>{
    return this.http.post<boolean>(this.apiUrl + "/Update/" + w.id, w);
  }

  deleteWorkerDisciplinaryReport(w: WorkerDisciplinaryReports):Observable<boolean>{
    return this.http.get<boolean>(this.apiUrl + "/Delete/" + w.id);
  }
}
