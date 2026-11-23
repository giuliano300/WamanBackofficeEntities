import { Component, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-sidebar',
    imports: [MatExpansionModule, RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    isEntity: boolean | null = null;
    isLocation: boolean | null = null;
    
    loginName: string = "";
    openCompactGroup: 'operations' | 'reporting' | null = null;

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private authService: AuthService,
        private notificationService: NotificationService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
            if (!isToggled) {
                this.openCompactGroup = null;
            }
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

         this.authService.loginName$.subscribe(val => {
            this.loginName = val || (localStorage.getItem('loginName')?.replace(/^"|"$/g, '')) || '';
        });
   }
    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    toggleCompactGroup(group: 'operations' | 'reporting', event: Event) {
        if (!this.isToggled || window.innerWidth < 1200) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.openCompactGroup = this.openCompactGroup === group ? null : group;
    }

    @HostListener('document:click')
    closeCompactGroup() {
        this.openCompactGroup = null;
    }

    // Mat Expansion
    panelOpenState = false;

    logout(){
        this.notificationService.stopConnection();
        // Subscribe before clearing storage so the interceptor captures the current token.
        this.authService.revokeSession().subscribe({ error: () => {} });
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
