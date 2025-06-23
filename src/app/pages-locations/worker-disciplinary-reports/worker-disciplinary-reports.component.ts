import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { CommonModule, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomDateFormatPipe } from '../../custom-date-format.pipe';
import { Router, RouterLink } from '@angular/router';
import { TemplatePdfService } from '../../services/template-pdf.service';
import { WorkerDisciplinaryReportsService } from '../../services/worker-disciplinary-reports.service';
import { UtilsService } from '../../utils.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { API_URL_DOC } from '../../../main';

@Component({
  selector: 'app-worker-disciplinary-reports',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption, 
    MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CustomDateFormatPipe, CommonModule, RouterLink],
  templateUrl: './worker-disciplinary-reports.component.html',
  styleUrl: './worker-disciplinary-reports.component.scss'
})
export class WorkerDisciplinaryReportsComponent {
  year: number | null = null;
  month: number | null = null;
  locationId: number | null = null;
  completeLocation: CompleteLocation | undefined = undefined;
  months: any[] = [];
  years: any[] = [];

  form: FormGroup;

   constructor(
        private router: Router,
        private workerDisciplinaryReportsService: WorkerDisciplinaryReportsService,
        private templatePdfService: TemplatePdfService,
        private utilService: UtilsService,
        private fb: FormBuilder
    ) 
    {
      this.form = this.fb.group({
        month: [null],
        year: [null]
      });
    }

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

    this.form.patchValue({ month: this.month, year: this.year });

    this.months = this.utilService.GetMonth();
  }

  onSubmit() {
    if (this.form.valid) {
        const month = this.form.value.month;
        const year = this.form.value.year;
        //this.getWorkersPlanning(month, year, jobType);
    }
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

}
