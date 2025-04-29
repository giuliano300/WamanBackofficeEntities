import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WamEntities } from '../../interfaces/Entities';
import { LocationsService } from '../../services/locations.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomDateFormatPipe } from '../../custom-date-format.pipe';

import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DetailLocationDialogComponent } from '../../detail-location-dialog/detail-location-dialog.component';


@Component({
  selector: 'app-locations',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {

  displayedColumns: string[] = ['name', 'locality', 'address', 'email','viewDetails', 'viewWorkers'];

  completeLocations: CompleteLocation[] = [];

  entity: WamEntities | null  = null;
  dataSource = new MatTableDataSource<CompleteLocation>(this.completeLocations);

  constructor(
      private dialog: MatDialog, 
      private router: Router,
      private locationsService: LocationsService
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

    this.getlocations();

  }


  getlocations(){
    this.locationsService.getLocations(this.entity!.id!)
        .subscribe((data: CompleteLocation[]) => {
          if (!data || data.length === 0) {
            console.log('Nessun dato disponibile');
          } else {
            this.completeLocations = data.map(c => ({
                ...c, 
                action: {
                    viewDetails: 'ri-menu-search-line',
                    viewWorkers: 'ri-user-search-line'
                }
            }));;
            this.dataSource = new MatTableDataSource<CompleteLocation>(this.completeLocations);
            this.dataSource.paginator = this.paginator;
        }
    });
  }

  gotoDetails(location:CompleteLocation){
    const dialogRef = this.dialog.open(DetailLocationDialogComponent, {
      data: location,
      width: '800px'
    });

  }

  gotoLocationDetail(location: CompleteLocation){
    this.router.navigate(['/location', location.location.id]);
  }

}
