import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplatePdfService {


  private apiUrl = API_URL + "TemplatePdf";

  constructor(private http: HttpClient) { }

  createAttendanceSheet(planningId: number, workerId: number): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + "/CreateAs?id=" + planningId + "&id2=" + workerId);
  }

  createAttendanceSheetZip(workerId: number, year: number, options?: any): Observable<string> {
    return this.http.get<string>(this.apiUrl + "/zip-attendance-sheets?workerId=" + workerId + "&year=" + year)
      .pipe(
        map((response: string) => {
          return response;  
        })
      );
  }  
  
}
