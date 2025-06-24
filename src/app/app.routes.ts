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
import { LocationIndexComponent } from './pages-locations/location-index/location-index.component';
import { PlanningWorkerLocationComponent } from './pages-locations/planning-worker-location/planning-worker-location.component';
import { InfoLocationComponent } from './pages-locations/info-location/info-location.component';
import { PlanningsComponent } from './pages-locations/plannings/plannings/plannings.component';
import { WorkerDisciplinaryReportsComponent } from './pages-locations/worker-disciplinary-reports/worker-disciplinary-reports.component';
import { WorkerIncidentAccidentReportsComponent } from './pages-locations/worker-incident-accident-reports/worker-incident-accident-reports.component';
import { AddComponent } from './pages-locations/worker-disciplinary-reports/add/add.component';
import { AddInComponent } from './pages-locations/worker-incident-accident-reports/add/addIn.component';

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
    //LOCATION PAGE
    { path: 'index', component: LocationIndexComponent},
    { path: 'info-location', component: InfoLocationComponent},
    { path: 'planning-worker-location/:id', component: PlanningWorkerLocationComponent},
    { path: 'plannings', component: PlanningsComponent},
    { path: 'worker-disciplinary-reports', component: WorkerDisciplinaryReportsComponent},
    { path: 'worker-disciplinary-reports/add', component: AddComponent},
    { path: 'worker-disciplinary-reports/add/:id', component: AddComponent},
    { path: 'worker-incident-accident-reports', component: WorkerIncidentAccidentReportsComponent},
    { path: 'worker-incident-accident-reports/add', component: AddInComponent},
    { path: 'worker-incident-accident-reports/add/:id', component: AddInComponent},

    { path: '**', component: NotFoundComponent},
];
