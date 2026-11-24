import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from './common/header/toggle.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'district-operation-frontend';
  isRouteLoading = false;
  isRouteFinishing = false;
  private routeLoadingTimer?: ReturnType<typeof setTimeout>;
  constructor(
    public router: Router,
    public toggleService: ToggleService,
    private loc: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.routeLoadingTimer);
        this.isRouteFinishing = false;
        this.isRouteLoading = true;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            this.document.querySelectorAll<HTMLDetailsElement>('.filter-panel[open]')
              .forEach(panel => panel.open = false);
          });
        }

        this.isRouteFinishing = true;
        this.routeLoadingTimer = setTimeout(() => {
          this.isRouteLoading = false;
          this.isRouteFinishing = false;
        }, 220);
      }
    });

  }
  
    routerSubscription: any;
    location: any;

   // Toggle Service
   isToggled = false;

   // Dark Mode
   toggleTheme() {
       this.toggleService.toggleTheme();
   }

   // Settings Button Toggle
   toggle() {
       this.toggleService.toggle();
   }

   // ngOnInit
   ngOnInit(){
     const token = localStorage.getItem('authToken');
     const currentPath = this.loc.path();
     const isPublicAuthenticationPath =
       currentPath === '/authentication' ||
       currentPath.startsWith('/authentication/forgot-password') ||
       currentPath.startsWith('/reset-password');

     if(!token && !isPublicAuthenticationPath)
        this.router.navigate(['/authentication']);
     
   }
}
