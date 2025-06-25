import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    imports: [NgScrollbarModule, MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    isEntity: boolean | null = null;
    isLocation: boolean | null = null;

    constructor(
        private router: Router,
        private toggleService: ToggleService,
        private authService: AuthService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        // SUBSCRIBE SEMPRE ATTIVO
        this.authService.isEntity$.subscribe(val => {
            console.log('Sidebar: isEntity changed', val);
            this.isEntity = val;
        });

        this.authService.isLocation$.subscribe(val => {
            console.log('Sidebar: isLocation changed', val);
            this.isLocation = val;
        });
    }
    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Mat Expansion
    panelOpenState = false;

    logout(){
        localStorage.removeItem('authToken');
        localStorage.removeItem('entity');
        localStorage.removeItem('completeLocation');
        localStorage.removeItem('location');
        localStorage.removeItem('isEntity');
        localStorage.removeItem('isLocation');
        this.authService.clearRoles();
        this.router.navigate(['/']);
    }

}