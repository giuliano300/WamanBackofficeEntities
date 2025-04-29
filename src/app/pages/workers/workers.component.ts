import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WamEntities } from '../../interfaces/Entities';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CompleteWorker } from '../../interfaces/CompleteWorker';
import { WorkersService } from '../../services/workers.service';
import { Workers } from '../../interfaces/Workers';


@Component({
  selector: 'app-workers',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.scss'
})
export class WorkersComponent {

  displayedColumns: string[] = ['name', 'lastName', 'mobile', 'email', 'idCardNumber', 'empNumber', 'jobType', 'viewDetails'];

  completeWorker: CompleteWorker[] = [];

  entity: WamEntities | null  = null;
  dataSource = new MatTableDataSource<CompleteWorker>(this.completeWorker);

  constructor(
      private dialog: MatDialog, 
      private router: Router,
      private workersService: WorkersService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const entity = localStorage.getItem('entity');
    if (!entity)
      this.router.navigate(['/']);

    this.entity! = JSON.parse(entity!);

    this.getWorkersFromEntity();

  }


  getWorkersFromEntity(){
    this.workersService.getWorkersFromEntity(this.entity!.id!)
        .subscribe((data: CompleteWorker[]) => {
          if (!data || data.length === 0) {
            console.log('Nessun dato disponibile');
          } else {
            this.completeWorker = data.map(c => ({
                ...c, 
                action: {
                    viewDetails: 'ri-menu-search-line',
                    viewWorkers: 'ri-user-search-line'
                }
            }));;
            this.dataSource = new MatTableDataSource<CompleteWorker>(this.completeWorker);
            this.dataSource.paginator = this.paginator;
        }
    });
  }

  gotoPlanning(worker: Workers){
      this.router.navigate(['/worker-planning', worker.id]);
    }
}
