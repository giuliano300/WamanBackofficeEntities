import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { WorkersComponent } from './pages/workers/workers.component';
import { LocationDetailComponent } from './pages/location-detail/location-detail.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { WorkerPlanningComponent } from './pages/worker-planning/worker-planning.component';
import { InfoComponent } from './pages/info/info.component';

export const routes: Routes = [
    { path: '', redirectTo : '/authentication', pathMatch: 'full' },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent}
        ]
    },
    { path: 'info', component: InfoComponent},
    { path: 'locations', component: LocationsComponent},
    { path: 'location/:id', component: LocationDetailComponent},
    { path: 'planning/:id/:locationId', component: PlanningComponent},
    { path: 'worker-planning/:id', component: WorkerPlanningComponent},
    { path: 'workers', component: WorkersComponent},
    { path: '**', component: NotFoundComponent}
];
