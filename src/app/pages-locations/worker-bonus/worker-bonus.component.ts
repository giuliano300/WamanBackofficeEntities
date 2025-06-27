import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkersService } from '../../services/workers.service';
import { CompleteWorker } from '../../interfaces/CompleteWorker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-bonus',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, 
    MatPaginatorModule, MatTableModule, MatCheckboxModule, CommonModule],
  templateUrl: './worker-bonus.component.html',
  styleUrl: './worker-bonus.component.scss'
})
export class WorkerBonusComponent {
  workerId: number | null = null;
  completeWorker: CompleteWorker | null = null;

  title = "";

  constructor(
      private router: Router,
      private workersService: WorkersService,
      private route: ActivatedRoute,
  ) 
  {
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const completeLocation = localStorage.getItem('completeLocation');
    if (!completeLocation)
      this.router.navigate(['/']);

    this.route.paramMap.subscribe(params => {
      this.workerId = parseInt(params.get('id')!);
      this.getWorkerById(this.workerId);
    });
  }

  getWorkerById(workerId: number){
    this.workersService.getWorkerById(workerId)
    .subscribe((data: CompleteWorker) => {
      this.completeWorker = data;
      this.title =  this.completeWorker.worker.name + " " + this.completeWorker.worker.lastName
    })
  };


  addWorkerBonus(){
     this.router.navigate(["/worker-bonus/add/" + this.workerId]);
  }
  back(){
     this.router.navigate(["/index"]);
  }
}
