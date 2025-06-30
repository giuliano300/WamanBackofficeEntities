import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { CommonModule, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomDateFormatPipe } from '../../custom-date-format.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompleteWorker } from '../../interfaces/CompleteWorker';
import { WorkersService } from '../../services/workers.service';
import { WorkerBonusService } from '../../services/worker-bonus.service';
import { CompleteWorkerBonus } from '../../interfaces/CompleteWorkerBonus';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BonusDialogComponent } from '../../bonus-dialog/bonus-dialog.component';

@Component({
  selector: 'app-worker-bonus-general',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption,
    MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CommonModule, MatProgressSpinnerModule, CustomDateFormatPipe],
  templateUrl: './worker-bonus-general.component.html',
  styleUrl: './worker-bonus-general.component.scss'
})
export class WorkerBonusGeneralComponent {
  workerId: number | null = null;
  completeWorker: CompleteWorker | null = null;
  completeWorkerBonus: CompleteWorkerBonus[] = [];

  dataSource = new MatTableDataSource<CompleteWorkerBonus>(this.completeWorkerBonus);
  
  isLoading: boolean = true;

  title = "";

  currentYear: number = new Date().getFullYear();

  years: number[] = [this.currentYear - 1, this.currentYear, this.currentYear + 1];

  quarters: any[] = [{id: 0, name: "all quarters"}, {id: 1, name: "1st quarter"}, {id: 2, name: "2nd quarter"}, {id: 3, name: "3rd quarter"}, {id: 4, name: "4th quarter"}];

  form: FormGroup;

  displayedColumns: string[] = ['reviewerName','reviewerRole', 'date', 'quarter', 'year', 'finalEvaluation', 'action'];

  constructor(
      private router: Router,
      private workersService: WorkersService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private workerBonusService: WorkerBonusService,
      private dialog: MatDialog
  ) 
  { 
    this.form = this.fb.group({
      period: [null],
      year: [this.currentYear, Validators.required]
    });
  }

  getQuarterName(id: number): string {
    const q = this.quarters.find(q => q.id === id);
    return q ? q.name : '';
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const entity = localStorage.getItem('entity');
    if (!entity)
      this.router.navigate(['/']);

    this.route.paramMap.subscribe(params => {
      this.workerId = parseInt(params.get('id')!);
      this.getWorkerById(this.workerId);
      this.getWorkerBonus(this.workerId, this.currentYear);
    });
  }

  getWorkerById(workerId: number){
    this.workersService.getWorkerById(workerId)
    .subscribe((data: CompleteWorker) => {
      this.completeWorker = data;
      this.title =  this.completeWorker.worker.name + " " + this.completeWorker.worker.lastName
    })
  };

  getWorkerBonus(workerId: number, year: number, period?: number){
    this.workerBonusService.getWorkerBonus(period, year, workerId)
    .subscribe((data: CompleteWorkerBonus[]) => {
      if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
          this.dataSource.data = [];
          this.isLoading = false;
      } 
      else 
      {
        this.completeWorkerBonus = data.map(c => ({
          ...c,
          action: {
            view: 'ri-menu-search-line'
          }
        }));
        this.dataSource = new MatTableDataSource<CompleteWorkerBonus>(this.completeWorkerBonus);
        this.isLoading = false;
      }
    })
  };

  onSubmit(){
    const period = this.form.value.period;
    const year = this.form.value.year;
    this.getWorkerBonus(this.workerId!, year, period);
  }

  back(){
     this.router.navigate(["/workers"]);
  }

  getFinalEvaluationAverage(): number {
    if (!this.dataSource?.data?.length) return 0;

    const sum = this.dataSource.data.reduce((acc, item) => acc + (item.workerBonus?.finalEvaluation || 0), 0);
    return sum / this.dataSource.data.length;
  }

  openDetail(item: CompleteWorkerBonus)
  {
    const dialogRef = this.dialog.open(BonusDialogComponent, {
          data: item,
          width: '800px',
          minWidth: '800px'
    });
  }
}
