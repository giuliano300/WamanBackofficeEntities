import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CompleteLocation } from '../../../interfaces/CompleteLocation';
import { NgFor, NgIf } from '@angular/common';
import { Workers } from '../../../interfaces/Workers';
import { CompleteWorker } from '../../../interfaces/CompleteWorker';
import { WorkersService } from '../../../services/workers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { WorkerIncidentAccidentReportsService } from '../../../services/worker-incident-accident-reports.service';
import { CompleteWorkerIncidentAccidentReports } from '../../../interfaces/CompleteWorkerIncidentAccidentReports';
import { WorkerIncidentAccidentReports } from '../../../interfaces/WorkerIncidentAccidentReports';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-add',
  imports: [MatIconModule,
    MatButtonModule,
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    FeathericonsModule, 
    MatSelectModule, 
    NgFor, 
    NgIf,
    NgxFileDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './addIn.component.html',
  styleUrl: './addIn.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddInComponent {
  completeLocation: CompleteLocation | null  = null;
  title: string = "Add Incident/Accident report";

  workers: Workers[] = [];

  uploadedFiles: { name: string, base64: string }[] = [];
  
  disciplinaryForm: FormGroup;

  constructor(
      private router: Router,
      private workersService: WorkersService,
      private workerIncidentAccidentReportsService: WorkerIncidentAccidentReportsService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private adapter: DateAdapter<any>
  ) 
  {
    this.adapter.setLocale('it-IT');
    this.disciplinaryForm = this.fb.group({
      workerId: [null, Validators.required],
      date: ['', Validators.required],
      place: ['', Validators.required],
      description: ['', Validators.required],
      uploadControl: [null],
      id: ['0']
    });
  }


  selectedWorkerId: number | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const completeLocation = localStorage.getItem('completeLocation');
    if (!completeLocation)
      this.router.navigate(['/']);

    this.completeLocation! = JSON.parse(completeLocation!);
    this.getWorkersFromLocation(this.completeLocation?.location.id!);


    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.title = "Update Incident/Accident report";

        this.workerIncidentAccidentReportsService.getWorkerIncidentAccidentReport(id)
          .subscribe((data: CompleteWorkerIncidentAccidentReports) => {
            this.disciplinaryForm.patchValue({
              workerId: data.worker.id,
              date: data.workerIncidentAccidentReport.date,
              place: data.workerIncidentAccidentReport.place,
              description: data.workerIncidentAccidentReport.description,
              id: id
            });

            const uploadFilesJson = data.workerIncidentAccidentReport.uploadFiles;
            this.uploadedFiles = uploadFilesJson ? JSON.parse(uploadFilesJson) : [];
          });
      }
    });

  }

  getWorkersFromLocation(locationId: number){
    this.workersService.getWorkersFromLocations(locationId)
    .subscribe((data: CompleteWorker[]) => {
      this.workers = data.map(a=>a.worker);
    })
  };

  onFileDrop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(file => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            this.uploadedFiles.push({
              name: file.name,
              base64: base64
            });
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
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

  returnBack(){
    this.router.navigate(["/worker-disciplinary-reports"]);
  }

  
  onSubmit() {
    if (this.disciplinaryForm.valid) {
      const formData = {
        ...this.disciplinaryForm.value,
        uploadFiles: this.uploadedFiles
      };

      const dateObj = new Date(formData.date);

      const formattedDate = dateObj.getFullYear() + '/' +   ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + ('0' + (dateObj.getDate() + 1)).slice(-2);

      const w: WorkerIncidentAccidentReports = {
        id: parseInt(formData.id),
        date:  new Date(formattedDate),
        locationId: this.completeLocation?.location.id!,
        entityId: this.completeLocation?.location.entityId!,
        workerId: formData.workerId,
        place: formData.place,
        uploadFiles: JSON.stringify(formData.uploadFiles),
        description: formData.description,
        deleted: false
      };

      if(formData.id > 0)
      {
        this.workerIncidentAccidentReportsService.updateWorkerIncidentAccidentReport(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/worker-incident-accident-reports"]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.workerIncidentAccidentReportsService.setWorkerIncidentAccidentReport(w)
        .subscribe((data: WorkerIncidentAccidentReports) => {
          if(data)
            this.router.navigate(["/worker-incident-accident-reports"]);
          else
            console.log("errore");
        })
      }
    } 
    else 
    {
      console.warn('Form non valido');
    }
  }
}
