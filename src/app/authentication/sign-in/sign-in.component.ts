import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor, NgIf } from '@angular/common';
import { Login } from '../../interfaces/Login';
import { WamEntities } from '../../interfaces/Entities';
import { EntitiesService } from '../../services/Entities.service';
import { UtilsService } from '../../utils.service';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { LoginType } from '../../interfaces/EnumType';
import { LocationsService } from '../../services/locations.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-in',
    imports: [MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOption, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf, NgFor],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    isError: boolean = false;
    wamEntity: WamEntities  | null = null;
    entity: WamEntities | null = null;
    completeLocation: CompleteLocation | null = null;
    options: any [] = [];

    constructor(
        private entityService: EntitiesService, 
        private fb: FormBuilder,
        private router: Router,
        private utilsService: UtilsService,
        private locationService: LocationsService,
        private authService: AuthService
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            type: ['', [Validators.required]]
        });
        this.options = [{id: 1, name: "Entity"}, {id: 2, name: "Location"}];
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    onSubmit() {
        if (this.authForm.valid) {
            let login:Login = {
                "email": this.authForm.value["email"],
                "pwd" : this.authForm.value["password"]
            };
            
            localStorage.setItem('type', this.authForm.value["type"].toString());

            if(this.authForm.value["type"] == LoginType.Entity)
                this.entityService.login(login).subscribe((data: WamEntities) => {
                    if(data == null)
                        this.isError = true;
                    else
                    {
                        this.entity! = data;
                        localStorage.setItem('isLocation', "false");
                        localStorage.setItem('isEntity', "true");
                        localStorage.setItem('loginName', this.entity!.name);
                        this.authService.setIsLocation(false);
                        this.authService.setIsEntity(true);
                        this.authService.setLoginName(this.entity.name);
                        localStorage.setItem('authToken', this.utilsService.generateToken());
                        localStorage.setItem('entity', JSON.stringify(this.entity!));
                        this.router.navigate(['/locations']);
                    }
                });
            
            if( this.authForm.value["type"] == LoginType.Location)
                this.locationService.login(login).subscribe((data: CompleteLocation) => {
                    if(data == null)
                        this.isError = true;
                    else
                    {
                        this.completeLocation! = data;
                        localStorage.setItem('isLocation', "true");
                        localStorage.setItem('isEntity', "false");
                        localStorage.setItem('loginName', this.completeLocation.location!.name);
                        this.authService.setIsLocation(true);
                        this.authService.setIsEntity(false);
                        this.authService.setLoginName(this.completeLocation.location!.name);
                        localStorage.setItem('authToken', this.utilsService.generateToken());
                        localStorage.setItem('completeLocation', JSON.stringify(this.completeLocation!));
                        this.router.navigate(['/plannings']);
                    }
                });
            
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }

    ngOnInit(): void {
        const token = localStorage.getItem('authToken');
        const isEntity: boolean = localStorage.getItem('isEntity') === 'true';
        const isLocation: boolean = localStorage.getItem('isLocation') === 'true';
        if (token) 
            if(isEntity)
                this.router.navigate(['/locations']);
            if(isLocation)
                 this.router.navigate(['/plannings']);
   }
   
}