import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WoerkerPlanningService } from '../../../services/woerker-planning.service';
import { CustomDateFormatPipe } from "../../../custom-date-format.pipe";
import { CommonModule, NgFor } from '@angular/common';
import { API_URL_DOC } from '../../../../main';
import { CompleteLocation } from '../../../interfaces/CompleteLocation';
import { LocationsService } from '../../../services/locations.service';
import { TemplatePdfService } from '../../../services/template-pdf.service';
import { PlanningWorker } from '../../../interfaces/PlanningWorker';
import { UtilsService } from '../../../utils.service';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JobTypes } from '../../../interfaces/JobTypes';
import { JobTypesService } from '../../../services/jobTypes.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-plannings',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CustomDateFormatPipe, CommonModule, RouterLink],
  templateUrl: './plannings.component.html',
  styleUrl: './plannings.component.scss',
  standalone: true
})
export class PlanningsComponent {

  displayedColumns: string[] = ['name', 'lastName', 'job', 'startWork', 'endWork','as', 'generate'];

  months: any[] = [];

  years: any[] = [];

  planningWorker: PlanningWorker[] = [];

  dataSource = new MatTableDataSource<PlanningWorker>(this.planningWorker);
  api_url: string | null = API_URL_DOC;

  locationId: number | null = null;

  generatingMap: { [key: string]: boolean } = {};

  completeLocation: CompleteLocation | undefined = undefined;

  year: number | null = null;
  month: number | null = null;

  jobtypes: JobTypes[] = [];

  nessunElementoGenerabile = false;

  form: FormGroup;

  constructor(
      private router: Router,
      private workerPlanningService: WoerkerPlanningService,
      private templatePdfService: TemplatePdfService,
      private utilService: UtilsService,
      private fb: FormBuilder,
      private jobTypesService: JobTypesService
  ) 
  {
    this.form = this.fb.group({
      month: [null],
      year: [null],
      jobType: [this.jobtypes[0]]
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  date:string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const stored = localStorage.getItem('completeLocation');
      if(!stored)
        this.router.navigate(['/authentication']);

    this.completeLocation = JSON.parse(stored!);

    this.locationId = this.completeLocation?.location.id!;

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;

    this.years = [this.year - 1, this.year , this.year + 1];

    this.getWorkersPlanning(this.month, this.year);

    this.form.patchValue({ month: this.month, year: this.year });

    this.getJobTypes();

    this.months = this.utilService.GetMonth();
  }


  getJobTypes(){
    this.jobTypesService.getJobTypes()
        .subscribe((data: JobTypes[]) => {
          if (!data || data.length === 0) {
            console.log('Nessun dato disponibile');
          } 
          else 
          {
            this.jobtypes = [{ id: 0, name: 'All jobs', deleted: false }, ...data];
            this.form.patchValue({
              jobType: this.jobtypes[0].id
            });
          }
    });
  }

  getWorkersPlanning(month:number, year: number, jobType?: number){
    this.workerPlanningService.getWorkersPlanning(month, year, this.locationId!, jobType)
        .subscribe((data: PlanningWorker[]) => {
          if (!data || data.length === 0) {
            console.log('Nessun dato disponibile');
            this.dataSource.data = [];
            this.dataSource.paginator = this.paginator;
          } else {
            this.planningWorker = data.map(c => ({
                ...c, 
                action: {
                    viewDetails: 'ri-menu-search-line',
                    viewWorkers: 'ri-user-search-line'
                }
            }));;
            this.dataSource = new MatTableDataSource<PlanningWorker>(this.planningWorker);
            this.dataSource.paginator = this.paginator;
            const elementsToGenerate = this.planningWorker.filter(el => !el.planning.pathFile);
            if(elementsToGenerate.length > 0)
              this.nessunElementoGenerabile = false;
            else
              this.nessunElementoGenerabile = true;
        }
    });
  }

  generateAllMissingAttendanceSheets() {
    const month = this.form.value.month;
    const year = this.form.value.year;
    const jobType = this.form.value.jobType;

    const elementsToGenerate = this.planningWorker.filter(el => !el.planning.pathFile);

    const observables = elementsToGenerate.map(el => {
      const key = `${el.planning.id}_${el.planning.workerId}`;
      this.generatingMap[key] = true;

      return this.templatePdfService.createAttendanceSheet(el.planning.id, el.planning.workerId).pipe(
        catchError(() => {
          console.error(`Errore durante la generazione di ${key}`);
          return of(false); // continua anche se una chiamata fallisce
        }),
        finalize(() => {
          this.generatingMap[key] = false;
        })
      );
    });

    if (observables.length === 0) {
      console.log('Nessun attendance sheet mancante');
      return;
    }

    forkJoin(observables).subscribe(results => {
      const successCount = results.filter(r => r).length;

      if (successCount > 0) {
        console.log(`Generati con successo ${successCount} attendance sheet`);
        this.getWorkersPlanning(month, year, jobType);
      } else {
        console.warn('Nessun file generato con successo.');
      }
    });
  }

  generateAs(planningId: number, workerId: number){
    const month = this.form.value.month;
    const year = this.form.value.year;
    const jobType = this.form.value.jobType;
    const key = `${planningId}_${workerId}`;
    this.generatingMap[key] = true;
    //id2 -workerId
    //id -planningId
    this.templatePdfService.createAttendanceSheet(planningId, workerId)
      .subscribe((data: boolean) => {
        this.generatingMap[key] = false;
        if(data)
          this.getWorkersPlanning(month, year, jobType);       
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

  downloadAllSheets(): void {
    const month = this.form.value.month;
    const year = this.form.value.year;
    const jobType = this.form.value.jobTypes;
    this.templatePdfService.createAttendanceSheetZipOfAllWorkers(month, year, this.locationId!, jobType)
      .subscribe(url => {
        window.open(API_URL_DOC + url, '_blank');  
      });
  }

  onSubmit() {
    if (this.form.valid) {
        const month = this.form.value.month;
        const year = this.form.value.year;
        const jobType = this.form.value.jobType;
        this.getWorkersPlanning(month, year, jobType);
    }
  }
  
}
