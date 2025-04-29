import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workers } from '../interfaces/Workers';
import { CompleteWorker } from '../interfaces/CompleteWorker';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  private apiUrl = API_URL + "Workers";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getWorkersFromLocations(locationId: number): Observable<CompleteWorker[]> {
    return this.http.get<CompleteWorker[]>(this.apiUrl + "/WorkersFromLocation?locationId=" + locationId);
  }

  getWorkersFromEntity(entityId: number): Observable<CompleteWorker[]> {
    return this.http.get<CompleteWorker[]>(this.apiUrl + "/WorkersFromEntity?entityId=" + entityId);
  }

}
