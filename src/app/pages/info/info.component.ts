import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router } from '@angular/router';
import { EntitiesService } from '../../services/Entities.service';
import { CompleteEntity } from '../../interfaces/CompleteEntity';
import { WamEntities } from '../../interfaces/Entities';

@Component({
  selector: 'app-info',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, MatSelectModule, FeathericonsModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  completeEntity: CompleteEntity | null  = null;
  entity: WamEntities | null  = null;

  constructor(
      private router: Router,
      private entityService: EntitiesService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const entity = localStorage.getItem('entity');
    if (!entity)
      this.router.navigate(['/']);

    this.entity! = JSON.parse(entity!);

    this.getInfo(this.entity!.id);
  }

    getInfo(id: number){
      this.entityService.getCompleteEntity(id)
          .subscribe((data: CompleteEntity) => {
            if (!data)
              console.log('Nessun dato disponibile');
            else 
              this.completeEntity = data;
            })
    }
}
