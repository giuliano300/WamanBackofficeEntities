import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WamEntities } from '../../interfaces/Entities';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WoerkerPlanningService } from '../../services/woerker-planning.service';
import { CompleteWorkerPlanning } from '../../interfaces/CompleteWorkerPlanning';
import { CompleteWp } from '../../interfaces/CompleteWp';
import { CustomDateFormatPipe } from "../../custom-date-format.pipe";
import { CommonModule } from '@angular/common';
import { API_URL_DOC } from '../../../main';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { LocationsService } from '../../services/locations.service';
import { TemplatePdfService } from '../../services/template-pdf.service';


@Component({
  selector: 'app-planning',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CustomDateFormatPipe, CommonModule, RouterLink],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent {

  displayedColumns: string[] = ['month', 'location', 'entityType', 'startWork', 'endWork', 'totalHours','as', 'generate'];

  completeWorkerPlanning: CompleteWorkerPlanning | null = null;
  completeWp: CompleteWp[] = [];

  entity: WamEntities | null  = null;
  dataSource = new MatTableDataSource<CompleteWp>(this.completeWp);
  api_url: string | null = API_URL_DOC;

  locationId: string | null = null;

  generatingMap: { [key: string]: boolean } = {};

  completeLocation: CompleteLocation | undefined = undefined;

  constructor(
      private dialog: MatDialog, 
      private router: Router,
      private route: ActivatedRoute,
      private workerPlanningService: WoerkerPlanningService,
      private locationsService: LocationsService,
      private templatePdfService: TemplatePdfService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  date:string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const id = this.route.snapshot.paramMap.get('id');
    if(!id)
      this.router.navigate(['/']);

    this.locationId = this.route.snapshot.paramMap.get('locationId');

    this.date = new Date().getFullYear().toString();

    this.getWorkerPlanning(parseInt(id!), parseInt(this.date));

    this.locationsService.getLocation(this.locationId!)
      .subscribe((data: CompleteLocation) => {
        this.completeLocation = data;
    });


  }


  getWorkerPlanning(workerId:number, year: number){
    this.workerPlanningService.getWorkerPlanning(workerId, year, parseInt(this.locationId!))
        .subscribe((data: CompleteWorkerPlanning) => {
          if (!data || data.completeWp.length === 0) {
            console.log('Nessun dato disponibile');
          } else {
            this.completeWorkerPlanning = data;
            this.completeWp = data.completeWp.map(c => ({
                ...c, 
                action: {
                    viewDetails: 'ri-menu-search-line',
                    viewWorkers: 'ri-user-search-line'
                }
            }));;
            this.dataSource = new MatTableDataSource<CompleteWp>(this.completeWp);
            this.dataSource.paginator = this.paginator;
        }
    });
  }

  generateAs(planningId: number, workerId: number){
    const key = `${planningId}_${workerId}`;
    this.generatingMap[key] = true;
    //id2 -workerId
    //id -planningId
    this.templatePdfService.createAttendanceSheet(planningId, workerId)
      .subscribe((data: boolean) => {
        this.generatingMap[key] = false;
        if(data)
          this.getWorkerPlanning(workerId,parseInt(this.date!));       
        else 
          console.log("errore");
      });
  }

  // Funzione per calcolare la differenza in ore tra startTime e endTime
  calculateTotalHours(startTime: string, endTime: string): number {
    const start = this.convertToDate(startTime);
    const end = this.convertToDate(endTime);
    const diffInMs = end.getTime() - start.getTime();
    return diffInMs / (1000 * 60 * 60); // Restituisce la differenza in ore
  }

  // Funzione per convertire una stringa "HH:mm" in oggetto Date
  private convertToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Imposta ore e minuti
    return date;
  }

  downloadAllSheets(workerId: number): void {
    this.templatePdfService.createAttendanceSheetZip(workerId, parseInt(this.date!))
    .subscribe(url => {
      window.open(API_URL_DOC + url, '_blank');  
    });
  }
  
}
