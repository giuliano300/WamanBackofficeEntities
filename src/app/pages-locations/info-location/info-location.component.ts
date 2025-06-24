import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router } from '@angular/router';
import { EntitiesService } from '../../services/Entities.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';

@Component({
  selector: 'app-info-location',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, MatSelectModule, FeathericonsModule],
  templateUrl: './info-location.component.html',
  styleUrl: './info-location.component.scss'
})
export class InfoLocationComponent {
  completeLocation: CompleteLocation | null  = null;

  constructor(
      private router: Router,
      private entityService: EntitiesService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const completeLocation = localStorage.getItem('completeLocation');
    if (!completeLocation)
      this.router.navigate(['/']);

    this.completeLocation! = JSON.parse(completeLocation!);
  }
}
