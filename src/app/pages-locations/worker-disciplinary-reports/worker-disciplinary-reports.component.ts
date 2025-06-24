import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { CommonModule, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomDateFormatPipe } from '../../custom-date-format.pipe';
import { Router, RouterLink } from '@angular/router';
import { TemplatePdfService } from '../../services/template-pdf.service';
import { WorkerDisciplinaryReportsService } from '../../services/worker-disciplinary-reports.service';
import { UtilsService } from '../../utils.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { API_URL_DOC } from '../../../main';
import { CompleteWorkerDisciplinaryReports } from '../../interfaces/CompleteWorkerDisciplinaryReports';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-worker-disciplinary-reports',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption,
    MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CommonModule, RouterLink, CustomDateFormatPipe, MatProgressSpinnerModule],
  templateUrl: './worker-disciplinary-reports.component.html',
  styleUrl: './worker-disciplinary-reports.component.scss'
})
export class WorkerDisciplinaryReportsComponent {
  year: number | null = null;
  month: number | null = null;
  locationId: number | null = null;
  completeLocation: CompleteLocation | undefined = undefined;
  completeWorkerDisciplinaryReports : CompleteWorkerDisciplinaryReports[] | undefined = undefined;
  months: any[] = [];
  years: any[] = [];
  dataSource = new MatTableDataSource<CompleteWorkerDisciplinaryReports>(this.completeWorkerDisciplinaryReports);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['insertDate', 'name', 'lastName', 'disciplinaryAction', 'actionsTaken', 'reason', 'uploadFiles','action'];

  form: FormGroup;

  isLoading: boolean = true;

  constructor(
      private router: Router,
      private workerDisciplinaryReportsService: WorkerDisciplinaryReportsService,
      private templatePdfService: TemplatePdfService,
      private utilService: UtilsService,
      private fb: FormBuilder,
      private dialog: MatDialog
  ) 
  {
    this.form = this.fb.group({
      month: [null],
      year: [null]
    });
  }

  ngOnInit(): void {

    this.isLoading = true;

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

    this.form.patchValue({ month: this.month, year: this.year });

    this.months = this.utilService.GetMonth();

    this.getWorkerDisciplinaryReports(this.month, this.year);
  }

  onSubmit() {
    if (this.form.valid) {
        const month = this.form.value.month;
        const year = this.form.value.year;
        this.getWorkerDisciplinaryReports(month, year);
    }
  }

  getWorkerDisciplinaryReports(month:number, year: number){
    this.workerDisciplinaryReportsService.getWorkerDisciplinaryReports(month, year, 0, this.locationId!)
      .subscribe((data: CompleteWorkerDisciplinaryReports[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
          this.dataSource.data = [];
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        } 
        else 
        {
          this.completeWorkerDisciplinaryReports = data.map(c => ({
              ...c,
              workerDisciplinaryReport: {
                ...c.workerDisciplinaryReport,
                uploadFiles: typeof c.workerDisciplinaryReport.uploadFiles === 'string'
                  ? JSON.parse(c.workerDisciplinaryReport.uploadFiles)
                  : c.workerDisciplinaryReport.uploadFiles
              },
              action: {
                  edit: 'ri-edit-line',
                  delete: 'ri-delete-bin-line'
              }
          }));;
          this.dataSource = new MatTableDataSource<CompleteWorkerDisciplinaryReports>(this.completeWorkerDisciplinaryReports);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
    });
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


  downloadFile(file: { name: string, base64: string }) {
    const byteCharacters = atob(file.base64);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }


  UpdateItem(item:CompleteWorkerDisciplinaryReports){
     this.router.navigate(["/worker-disciplinary-reports/add/" + item.workerDisciplinaryReport.id]);
  }


  DeleteItem(item:CompleteWorkerDisciplinaryReports){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.workerDisciplinaryReportsService.deleteWorkerDisciplinaryReport(item.workerDisciplinaryReport)
          .subscribe((data: boolean) => {
            if(data){
              const month = this.form.value.month;
              const year = this.form.value.year;
              this.getWorkerDisciplinaryReports(month, year);
            }
          });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }

}
