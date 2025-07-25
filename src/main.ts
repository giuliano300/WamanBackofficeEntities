import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

// Definisci l'URL globale dell'API
export const API_URL_DOC = 'https://backend.waman.app/';
export const API_URL = API_URL_DOC + 'api/';
export const exceedsLimit = 3;
export const maxLenghtUploadFile = 2;

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(), 
    provideHttpClient(),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));