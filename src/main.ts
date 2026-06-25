import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { wamanClientInterceptor } from './app/waman-client.interceptor';

// Definisci l'URL globale dell'API
export const API_URL_DOC = 'https://auth.waman.app/';
export const API_URL = API_URL_DOC + 'api/';
export const exceedsLimit = 3;
export const maxLenghtUploadFile = 2;

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(), 
    provideHttpClient(withInterceptors([wamanClientInterceptor])),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));
