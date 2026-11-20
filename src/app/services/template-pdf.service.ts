import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TemplatePdfService {


  private apiUrl = API_URL + "TemplatePdf";

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  openAttendanceSheet(planningId: number): void {
    this.http.get<{url: string}>(API_URL + 'Files/GetSecureUrl/' + planningId, {params: {type: 'att'}})
      .subscribe({next: result => window.open(result.url, '_blank', 'noopener'), error: () => this.snackBar.open('The document is unavailable or your session has expired.', 'Close', {duration: 6000})});
  }

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
  
  createAttendanceSheetZipOfAllWorkers(month: number, year: number, locationId: number, jobType?: number, options?: any): Observable<string> {
    return this.http.get<string>(this.apiUrl + "/zip-attendance-sheets-of-all-workers?month=" + month + "&year=" + year + "&locationId=" + locationId + "&jobType=" + jobType)
      .pipe(
        map((response: string) => {
          return response;  
        })
      );
  }  
  
}
