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
import { UtilsService } from '../../utils.service';
import { API_URL_DOC } from '../../../main';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkerIncidentAccidentReportsService } from '../../services/worker-incident-accident-reports.service';
import { CompleteWorkerIncidentAccidentReports } from '../../interfaces/CompleteWorkerIncidentAccidentReports';
import { WamEntities } from '../../interfaces/Entities';
import { IncidentAccidentDialogComponent } from '../../incident-accident-dialog/incident-accident-dialog.component';


@Component({
  selector: 'app-entity-incident-accident-reports',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption,
    MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CommonModule, RouterLink, CustomDateFormatPipe, MatProgressSpinnerModule],
  templateUrl: './entity-incident-accident-report.component.html',
  styleUrl: './entity-incident-accident-report.component.scss'
})
export class EntityIncidentAccidentReportComponent {
  year: number | null = null;
  month: number | null = null;
  entityId: number | null = null;
  entity: WamEntities | undefined = undefined;
  completeWorkerIncidentAccidentReports : CompleteWorkerIncidentAccidentReports[] | undefined = undefined;
  months: any[] = [];
  years: any[] = [];
  dataSource = new MatTableDataSource<CompleteWorkerIncidentAccidentReports>(this.completeWorkerIncidentAccidentReports);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'location', 'name', 'lastName', 'place', 'uploadFiles','action'];

  form: FormGroup;

  isLoading: boolean = true;

  constructor(
      private router: Router,
      private workerIncidentAccidentReportsService: WorkerIncidentAccidentReportsService,
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

    const entity = localStorage.getItem('entity');
    if (!entity)
      this.router.navigate(['/']);

    this.entity! = JSON.parse(entity!);

    this.entityId = this.entity?.id!;

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;

    this.years = [this.year - 1, this.year , this.year + 1];

    this.form.patchValue({ month: this.month, year: this.year });

    this.months = this.utilService.GetMonth();

    this.getWorkerIncidentAccidentReports(this.month, this.year);
  }

  onSubmit() {
    if (this.form.valid) {
        const month = this.form.value.month;
        const year = this.form.value.year;
        this.getWorkerIncidentAccidentReports(month, year);
    }
  }

  getWorkerIncidentAccidentReports(month:number, year: number){
    this.workerIncidentAccidentReportsService.getWorkerIncidentAccidentReports(month, year, 0, 0, this.entityId!)
      .subscribe((data: CompleteWorkerIncidentAccidentReports[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
          this.dataSource.data = [];
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        } 
        else 
        {
          this.completeWorkerIncidentAccidentReports = data.map(c => ({
              ...c,
              workerIncidentAccidentReport: {
                ...c.workerIncidentAccidentReport,
                uploadFiles: typeof c.workerIncidentAccidentReport.uploadFiles === 'string'
                  ? JSON.parse(c.workerIncidentAccidentReport.uploadFiles)
                  : c.workerIncidentAccidentReport.uploadFiles
              },
              action: {
                  view: 'ri-menu-search-line'
              }
          }));;
          this.dataSource = new MatTableDataSource<CompleteWorkerIncidentAccidentReports>(this.completeWorkerIncidentAccidentReports);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
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

  openDetail(item:CompleteWorkerIncidentAccidentReports)
  {
    const dialogRef = this.dialog.open(IncidentAccidentDialogComponent, {
          data: item,
          width: '800px',
          minWidth: '800px'
   });
  }

}
