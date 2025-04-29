import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompleteLocation } from '../interfaces/CompleteLocation';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private apiUrl = API_URL + "Locations";

  constructor(private http: HttpClient) { }
  // Metodo per ottenere le location
  getLocations(entityId: number): Observable<CompleteLocation[]> {
    return this.http.get<CompleteLocation[]>(this.apiUrl + "?entityId=" + entityId);
  }

  // Metodo per ottenere le location
  getLocation(locationId: string): Observable<CompleteLocation> {
    return this.http.get<CompleteLocation>(this.apiUrl + "/" + locationId);
  }

}
