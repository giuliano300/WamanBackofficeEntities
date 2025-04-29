import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { WamEntities } from '../interfaces/Entities';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { CompleteEntity } from '../interfaces/CompleteEntity';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

    private apiUrl = API_URL + "WamEntities";
    
    constructor(private http: HttpClient) {}

    login(login:Login): Observable<WamEntities>{
      return this.http.post<any>(this.apiUrl + "/login", login);
    }

  getCompleteEntity(entityId: number): Observable<CompleteEntity> {
    return this.http.get<CompleteEntity>(this.apiUrl + "/GetCompleteEntity/" + entityId);
  }

}
