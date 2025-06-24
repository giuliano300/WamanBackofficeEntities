import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompleteWorkerIncidentAccidentReports } from '../interfaces/CompleteWorkerIncidentAccidentReports';
import { WorkerIncidentAccidentReports } from '../interfaces/WorkerIncidentAccidentReports';

@Injectable({
  providedIn: 'root'
})
export class WorkerIncidentAccidentReportsService {
  private apiUrl = API_URL + "WorkerIncidentAccidentReports";

  constructor(private http: HttpClient) { }
    // Metodo per ottenere le location
    getWorkerIncidentAccidentReports(month?: number, year?: number, workerId?: number, locationId?: number, entityId?: number): Observable<CompleteWorkerIncidentAccidentReports[]> {
      return this.http.get<CompleteWorkerIncidentAccidentReports[]>(this.apiUrl + "?workerId=" + workerId + "&year=" + year + "&month=" + month + "&locationId=" + locationId + "&entityId=" + entityId);
    }
  
    getWorkerIncidentAccidentReport(id: string): Observable<CompleteWorkerIncidentAccidentReports> {
      return this.http.get<CompleteWorkerIncidentAccidentReports>(this.apiUrl + "/" + id);
    }
  
    setWorkerIncidentAccidentReport(w: WorkerIncidentAccidentReports):Observable<WorkerIncidentAccidentReports>{
      return this.http.post<WorkerIncidentAccidentReports>(this.apiUrl + "/New", w);
    }
  
    updateWorkerIncidentAccidentReport(w: WorkerIncidentAccidentReports):Observable<boolean>{
      return this.http.post<boolean>(this.apiUrl + "/Update/" + w.id, w);
    }
  
    deleteWorkerIncidentAccidentReport(w: WorkerIncidentAccidentReports):Observable<boolean>{
      return this.http.get<boolean>(this.apiUrl + "/Delete/" + w.id);
    }
  
}
