import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf, registerLocaleData } from '@angular/common';
import { CompleteWorker } from '../../../interfaces/CompleteWorker';
import { WorkersService } from '../../../services/workers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import localeIt from '@angular/common/locales/it';
import { Component, LOCALE_ID } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WorkerBonusService } from '../../../services/worker-bonus.service';
import { CompleteWorkerBonus } from '../../../interfaces/CompleteWorkerBonus';
import { WorkerBonus } from '../../../interfaces/WorkerBonus';
import { CompleteLocation } from '../../../interfaces/CompleteLocation';

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
  standalone: true,
  selector: 'appWB-add',
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
      NgxFileDropModule,
      MatDatepickerModule,
      MatNativeDateModule
    ],
    templateUrl: './addWb.component.html',
    styleUrl: './addWb.component.scss',
    providers: [
      { provide: LOCALE_ID, useValue: 'it-IT' },
      { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ]
})
export class AddWbComponent {

    workerId: number | null = null;
    workerBonusId: string | null = null;
    completeWorker: CompleteWorker | null = null;
    completeLocation: CompleteLocation | null = null;

    title = "";

    currentYear: number = new Date().getFullYear();

    years: number[] = [this.currentYear - 1, this.currentYear, this.currentYear + 1];

    ten: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    quarters: any[] = [{id:1, name: "1st quarter"}, {id:2, name: "2nd quarter"}, {id:3, name: "3rd quarter"}, {id:4, name: "4th quarter"}]
     
    bunusForm: FormGroup;

    constructor(
        private router: Router,
        private workersService: WorkersService,
        private workerBonusService: WorkerBonusService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
      private adapter: DateAdapter<any>
    ) 
    {
        this.adapter.setLocale('it-IT');
        this.bunusForm = this.fb.group({
          reviewerName: ['', Validators.required],
          reviewerRole: ['', Validators.required],
          date: ['', Validators.required],
          year: [this.currentYear, Validators.required],
          quarter: ['', Validators.required],
          sensitivityTowardsEntityEnvironment: ['', Validators.required],
          timeManagement: ['', Validators.required],
          respectingAdministrativeProcedures: ['', Validators.required],
          appropriateGoodUseEquipmentAndOrMachineryITEquipment: ['', Validators.required],
          teamPlayer: ['', Validators.required],
          energyDeterminationWorkRate: ['', Validators.required],
          respectTowardsAuthorityAndIntegrity: ['', Validators.required],
          adaptabilityFlexibilityAndMobility: ['', Validators.required],
          personalAppearanceAndImage: ['', Validators.required],
          communicationsSkills: ['', Validators.required],
          id: [0, Validators.required]
        });
    }
    ngOnInit(): void {
        const token = localStorage.getItem('authToken');
        if (!token) 
          this.router.navigate(['/']);

        const completeLocation = localStorage.getItem('completeLocation');
        if (!completeLocation)
          this.router.navigate(['/']);

        this.completeLocation = JSON.parse(completeLocation!);

        this.route.paramMap.subscribe(params => {
          this.workerId = parseInt(params.get('id')!);
          this.getWorkerById(this.workerId);

          this.workerBonusId = params.get('id2');
          if(this.workerBonusId){
            //UPDATE
            this.workerBonusService.getWorkerBonusId(this.workerBonusId)
            .subscribe((data: CompleteWorkerBonus) => {
              this.bunusForm.patchValue({
                reviewerName: data.workerBonus.reviewerName,
                reviewerRole:data.workerBonus.reviewerRole,
                date: data.workerBonus.date,
                year: data.workerBonus.year,
                quarter: data.workerBonus.quarter,
                sensitivityTowardsEntityEnvironment: data.workerBonus.sensitivityTowardsEntityEnvironment,
                timeManagement: data.workerBonus.timeManagement,
                respectingAdministrativeProcedures: data.workerBonus.respectingAdministrativeProcedures,
                appropriateGoodUseEquipmentAndOrMachineryITEquipment: data.workerBonus.appropriateGoodUseEquipmentAndOrMachineryITEquipment,
                teamPlayer: data.workerBonus.teamPlayer,
                energyDeterminationWorkRate: data.workerBonus.energyDeterminationWorkRate,
                respectTowardsAuthorityAndIntegrity: data.workerBonus.respectTowardsAuthorityAndIntegrity,
                adaptabilityFlexibilityAndMobility: data.workerBonus.adaptabilityFlexibilityAndMobility,
                personalAppearanceAndImage: data.workerBonus.personalAppearanceAndImage,
                communicationsSkills: data.workerBonus.communicationsSkills,

                id: this.workerBonusId
              });

              this.title = "Update bonus of " + this.completeWorker!.worker.name + " " + this.completeWorker!.worker.lastName

          });

          }

        });
    }

    getWorkerById(workerId: number){
      this.workersService.getWorkerById(workerId)
      .subscribe((data: CompleteWorker) => {
        this.completeWorker = data;
        this.title = "Add bonus of " + this.completeWorker.worker.name + " " + this.completeWorker.worker.lastName
      })
    };

    returnBack(){
      this.router.navigate(["/worker-bonus/" + this.workerId]);
    }
    
    onSubmit(){
    if (this.bunusForm.valid) {
      const formData = this.bunusForm.value;

  
      const dateObj = new Date(formData.date);

      const formattedDate = dateObj.getFullYear() + '/' +   ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + ('0' + (dateObj.getDate() + 1)).slice(-2);

      const w: WorkerBonus = {
        id: parseInt(formData.id),
        date: new Date(formattedDate),
        locationId: this.completeLocation?.location.id!,
        entityId: this.completeLocation?.location.entityId!,
        workerId: this.workerId!,
        reviewerName: formData.reviewerName,
        reviewerRole: formData.reviewerRole,
        year: formData.year,
        quarter: formData.quarter,
        sensitivityTowardsEntityEnvironment: formData.sensitivityTowardsEntityEnvironment,
        timeManagement: formData.timeManagement,
        respectingAdministrativeProcedures: formData.respectingAdministrativeProcedures,
        appropriateGoodUseEquipmentAndOrMachineryITEquipment: formData.appropriateGoodUseEquipmentAndOrMachineryITEquipment,
        teamPlayer: formData.teamPlayer,
        energyDeterminationWorkRate: formData.energyDeterminationWorkRate,
        respectTowardsAuthorityAndIntegrity: formData.respectTowardsAuthorityAndIntegrity,
        adaptabilityFlexibilityAndMobility: formData.adaptabilityFlexibilityAndMobility,
        personalAppearanceAndImage: formData.personalAppearanceAndImage,
        communicationsSkills: formData.communicationsSkills,
        finalEvaluation: this.totalEvaluation(formData),
        deleted: false
      };

      if(formData.id > 0)
      {
        this.workerBonusService.updateWorkerBonus(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/worker-bonus/" + this.workerId]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.workerBonusService.setWorkerBonus(w)
        .subscribe((data: WorkerBonus) => {
          if(data)
            this.router.navigate(["/worker-bonus/" + this.workerId]);
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

  totalEvaluation(formData: WorkerBonus){
    //PER IL MOMENTO SOMMA TUTTI I CAMPI
    const t = formData.sensitivityTowardsEntityEnvironment + 
      formData.timeManagement +
      formData.respectingAdministrativeProcedures +
      formData.appropriateGoodUseEquipmentAndOrMachineryITEquipment +
      formData.teamPlayer +
      formData.energyDeterminationWorkRate +
      formData.respectTowardsAuthorityAndIntegrity +
      formData.adaptabilityFlexibilityAndMobility +
      formData.personalAppearanceAndImage +
      formData.communicationsSkills;
    return t;
  }
}
