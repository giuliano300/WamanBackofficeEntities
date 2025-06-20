import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompleteWorker } from '../interfaces/CompleteWorker';
import { JobTypes } from '../interfaces/JobTypes';

@Injectable({
  providedIn: 'root'
})
export class JobTypesService {

  private apiUrl = API_URL + "JobTypes";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getJobTypes(): Observable<JobTypes[]> {
    return this.http.get<JobTypes[]>(this.apiUrl);
  }
}
