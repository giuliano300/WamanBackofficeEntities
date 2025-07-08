import { Component } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { ToggleService } from './toggle.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {
  
    isEntity: boolean | null = null;
    isLocation: boolean | null = null;

    area: string = "";

    constructor(
        public toggleService: ToggleService,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.formattedDate = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

         this.authService.isEntity$.subscribe(val => {
            console.log('Sidebar: isEntity changed', val);
            this.isEntity = val;
        });

        this.authService.isLocation$.subscribe(val => {
            console.log('Sidebar: isLocation changed', val);
            this.isLocation = val;
        });
        this.authService.loginName$.subscribe(val => {
            this.area = val || (localStorage.getItem('loginName')?.replace(/^"|"$/g, '')) || '';
        });

        if(this.isEntity)
            this.area = "Entity area";
        if(this.isLocation)
            this.area = "Location area";
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Current Date
    currentDate: Date = new Date();
    formattedDate: any;

}