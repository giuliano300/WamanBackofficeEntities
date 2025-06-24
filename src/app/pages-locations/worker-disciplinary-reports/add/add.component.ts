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
import { WorkerDisciplinaryReports } from '../../../interfaces/WorkerDisciplinaryReport';
import { WorkerDisciplinaryReportsService } from '../../../services/worker-disciplinary-reports.service';
import { CompleteWorkerDisciplinaryReports } from '../../../interfaces/CompleteWorkerDisciplinaryReports';

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
    NgxFileDropModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  completeLocation: CompleteLocation | null  = null;
  title: string = "Add Disciplinary report";

  workers: Workers[] = [];

  uploadedFiles: { name: string, base64: string }[] = [];
  
  disciplinaryForm: FormGroup;

  constructor(
      private router: Router,
      private workersService: WorkersService,
      private workerDisciplinaryReportsService: WorkerDisciplinaryReportsService,
      private fb: FormBuilder,
      private route: ActivatedRoute
  ) 
  {
    this.disciplinaryForm = this.fb.group({
      workerId: [null, Validators.required],
      disciplinaryAction: ['', Validators.required],
      actionsTaken: ['', Validators.required],
      reason: ['', Validators.required],
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
        this.title = "Update Disciplinary report";

        this.workerDisciplinaryReportsService.getWorkerDisciplinaryReport(id)
          .subscribe((data: CompleteWorkerDisciplinaryReports) => {
            this.disciplinaryForm.patchValue({
              workerId: data.worker.id,
              disciplinaryAction: data.workerDisciplinaryReport.disciplinaryAction,
              actionsTaken: data.workerDisciplinaryReport.actionsTaken,
              reason: data.workerDisciplinaryReport.reason,
              id: id
            });

            const uploadFilesJson = data.workerDisciplinaryReport.uploadFiles;
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
    this.uploadedFiles = []; // reset

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

      const w: WorkerDisciplinaryReports = {
        id: parseInt(formData.id),
        insertDate: new Date(),
        locationId: this.completeLocation?.location.id!,
        entityId: this.completeLocation?.location.entityId!,
        workerId: formData.workerId,
        disciplinaryAction: formData.disciplinaryAction,
        actionsTaken: formData.actionsTaken,
        reason: formData.reason,
        uploadFiles: JSON.stringify(formData.uploadFiles),
        deleted: false
      };

      if(formData.id > 0)
      {
        this.workerDisciplinaryReportsService.updateWorkerDisciplinaryReport(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/worker-disciplinary-reports"]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.workerDisciplinaryReportsService.setWorkerDisciplinaryReport(w)
        .subscribe((data: WorkerDisciplinaryReports) => {
          if(data)
            this.router.navigate(["/worker-disciplinary-reports"]);
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
