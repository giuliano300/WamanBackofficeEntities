import { ChangeDetectorRef, Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { CompleteLocation } from '../../../interfaces/CompleteLocation';
import { Workers } from '../../../interfaces/Workers';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkersService } from '../../../services/workers.service';
import { WorkerIncidentAccidentReportsService } from '../../../services/worker-incident-accident-reports.service';
import { CompleteWorkerIncidentAccidentReports } from '../../../interfaces/CompleteWorkerIncidentAccidentReports';
import { CompleteWorker } from '../../../interfaces/CompleteWorker';
import { WorkerIncidentAccidentReports } from '../../../interfaces/WorkerIncidentAccidentReports';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { exceedsLimit, maxLenghtUploadFile } from '../../../../main';
import { AlertDialogComponent } from '../../../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WamEntities } from '../../../interfaces/Entities';
import { LocationsService } from '../../../services/locations.service';

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
  selector: 'appIn-add',
  standalone: true,
  templateUrl: './addInAccRep.component.html',
  styleUrls: ['./addInAccRep.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    FeathericonsModule,
    NgxFileDropModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class addInAccRepComponent {
  entity: WamEntities | null  = null;
  title: string = "Add Incident/Accident report";

  dropZoneIsDisabled = false;

  workers: Workers[] = [];

  uploadedFiles: { name: string, base64: string }[] = [];
 
  rejectedFiles: { name: string; reason: string }[] = [];

  dismissTimeout: any;
 
  disciplinaryForm: FormGroup;

  completeLocations: CompleteLocation[] = [];

  constructor(
      private router: Router,
      private workersService: WorkersService,
      private workerIncidentAccidentReportsService: WorkerIncidentAccidentReportsService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private adapter: DateAdapter<any>,
      private dialog: MatDialog,
      private locationsService: LocationsService,
      private cdr: ChangeDetectorRef
  ) 
  {
    this.adapter.setLocale('it-IT');
    this.disciplinaryForm = this.fb.group({
      workerId: [null, Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      place: ['', Validators.required],
      description: ['', Validators.required],
      observations: ['', Validators.required],
      cause: ['', Validators.required],
      compilerName: ['', Validators.required],
      compilerRole: ['', Validators.required],
      compilerIdCardNumber: ['', Validators.required],
      emailCompiler: ['', Validators.required],
      mobileCompiler: ['', Validators.required],
      uploadControl: [null],
      locationId: ['', Validators.required],
      id: ['0']
    });
  }

  workersFromLocation(id: number) {
    this.getWorkersFromLocation(id);
  }  

  
  getlocations(){
    this.locationsService.getLocations(this.entity!.id!)
        .subscribe((data: CompleteLocation[]) => {
          if (!data || data.length === 0) {
            console.log('Nessun dato disponibile');
          } else {
            this.completeLocations = data;
        }
    });
  }

  selectedWorkerId: number | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const entity = localStorage.getItem('entity');
    if (!entity)
      this.router.navigate(['/']);

    this.entity! = JSON.parse(entity!);

    this.getlocations();

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
              observations: data.workerIncidentAccidentReport.observations,
              cause: data.workerIncidentAccidentReport.cause,
              hour: data.workerIncidentAccidentReport.hour,
              compilerName: data.workerIncidentAccidentReport.compilerName,
              compilerRole: data.workerIncidentAccidentReport.compilerRole,
              compilerIdCardNumber: data.workerIncidentAccidentReport.compilerIdCardNumber,
              emailCompiler: data.workerIncidentAccidentReport.emailCompiler,
              mobileCompiler: data.workerIncidentAccidentReport.mobileCompiler,
              locationId: data.workerIncidentAccidentReport.locationId,
              id: id
            });

            this.getWorkersFromLocation(data.workerIncidentAccidentReport.locationId, data.worker.id);

              const uploadFilesJson = data.workerIncidentAccidentReport.uploadFiles;
            this.uploadedFiles = uploadFilesJson ? JSON.parse(uploadFilesJson) : [];
          });
      }
    });

  }

  getWorkersFromLocation(locationId: number, workerId?: number){
    this.workersService.getWorkersFromLocations(locationId)
    .subscribe((data: CompleteWorker[]) => {
      this.workers = data.map(a=>a.worker);
      this.cdr.detectChanges();
        setTimeout(() => {
          this.disciplinaryForm.patchValue({
            workerId: workerId
        })
      });
    })
  };
  onFileDrop(files: NgxFileDropEntry[]) {
    this.rejectedFiles = [];

    if(this.uploadedFiles.length >= maxLenghtUploadFile){
      this.dropZoneIsDisabled = true;
      this.openAlertDialog();
      return;
    }

    let stopProcessing = false;

    for (const droppedFile of files) {
      if (stopProcessing) return;

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file(file => {
          if (stopProcessing) return;

          if (file.size > exceedsLimit * 1024 * 1024) {
            this.rejectedFiles.push({
              name: file.name,
              reason: 'File exceeds ' + exceedsLimit + ' MB limit'
            });
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              if (stopProcessing) return;

              if (this.uploadedFiles.length >= maxLenghtUploadFile) {
                this.dropZoneIsDisabled = true;
                this.openAlertDialog();
                stopProcessing = true;
                return;
              }

              const base64 = (reader.result as string).split(',')[1];
              this.uploadedFiles.push({
                name: file.name,
                base64: base64
              });

              // Dopo il push, controlliamo ancora
              if (this.uploadedFiles.length >= maxLenghtUploadFile) {
                this.dropZoneIsDisabled = true;
                this.openAlertDialog();
                stopProcessing = true;
              }
            };

            reader.readAsDataURL(file);
          }
        });
      }
    }    
    
    
    setTimeout(() => {
        this.rejectedFiles = [];
      }, 5000);
    }

    openAlertDialog(): void {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Completed',
          message: 'You have reached the maximum number of ' + maxLenghtUploadFile + ' files you can upload.'
        }
      });
    }

  dismissRejectedFiles() {
    clearTimeout(this.dismissTimeout);
    this.rejectedFiles = [];
  }


  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    if(this.uploadedFiles.length < maxLenghtUploadFile)
      this.dropZoneIsDisabled = false;
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
    this.router.navigate(["/entity-incident-accident-report"]);
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
        locationId: formData.locationId,
        entityId: this.entity!.id,
        workerId: formData.workerId,
        place: formData.place,
        uploadFiles: JSON.stringify(formData.uploadFiles),
        description: formData.description,
        deleted: false,
        hour : formData.hour,
        observations: formData.observations,
        cause: formData.cause,
        compilerName: formData.compilerName,
        compilerRole: formData.compilerRole,
        compilerIdCardNumber: formData.compilerIdCardNumber,
        emailCompiler: formData.emailCompiler,
        mobileCompiler: formData.mobileCompiler
      };

      if(formData.id > 0)
      {
        this.workerIncidentAccidentReportsService.updateWorkerIncidentAccidentReport(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/entity-incident-accident-report"]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.workerIncidentAccidentReportsService.setWorkerIncidentAccidentReport(w)
        .subscribe((data: WorkerIncidentAccidentReports) => {
          if(data)
            this.router.navigate(["/entity-incident-accident-report"]);
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
