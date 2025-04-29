import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterLink  } from '@angular/router';
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
import { LocationsService } from '../../services/locations.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { Workers } from '../../interfaces/Workers';


@Component({
  selector: 'app-location-detail',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, RouterLink],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.scss'
})
export class LocationDetailComponent {

  displayedColumns: string[] = ['name', 'lastName', 'mobile', 'email', 'idCardNumber', 'empNumber', 'jobType', 'viewDetails'];

  id: string | null = null;

  completeWorker: CompleteWorker[] = [];

  completeLocation: CompleteLocation | undefined = undefined;

  entity: WamEntities | null  = null;
  dataSource = new MatTableDataSource<CompleteWorker>(this.completeWorker);

  constructor(
      private dialog: MatDialog, 
      private router: Router,
      private workersService: WorkersService,
      private route: ActivatedRoute,
      private locationsService: LocationsService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const id = this.route.snapshot.paramMap.get('id');
    if(!id)
      this.router.navigate(['/']);
    
    this.id = id;

    this.locationsService.getLocation(id!)
        .subscribe((data: CompleteLocation) => {
          this.completeLocation = data;
          this.getWorkersFromLocation(data.location.id);
       });


  }

  getWorkersFromLocation(locationId: number){
    this.workersService.getWorkersFromLocations(locationId)
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
      this.router.navigate(['/planning', worker.id, this.id]);
  }
  
}
