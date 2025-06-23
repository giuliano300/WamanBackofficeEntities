import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompleteWorkerIncidentAccidentReports } from '../interfaces/CompleteWorkerIncidentAccidentReports';

@Injectable({
  providedIn: 'root'
})
export class WorkerIncidentAccidentReportsService {
  private apiUrl = API_URL + "WorkerIncidentAccidentReport";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkerIncidentAccidentReport(month?: number, year?: number, workerId?: number, locationId?: number): Observable<CompleteWorkerIncidentAccidentReports[]> {
    return this.http.get<CompleteWorkerIncidentAccidentReports[]>(this.apiUrl + "?workerId=" + workerId + "&year=" + year + "&month=" + month + "&locationId=" + locationId);
  }
}
