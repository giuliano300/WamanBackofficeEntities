import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteWorkerDisciplinaryReports } from '../interfaces/CompleteWorkerDisciplinaryReports';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerDisciplinaryReportsService {

  private apiUrl = API_URL + "WorkerDisciplinaryReports";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkerIncidentAccidentReport(month?: number, year?: number, workerId?: number, locationId?: number): Observable<CompleteWorkerDisciplinaryReports[]> {
    return this.http.get<CompleteWorkerDisciplinaryReports[]>(this.apiUrl + "?workerId=" + workerId + "&year=" + year + "&month=" + month + "&locationId=" + locationId);
  }
}
