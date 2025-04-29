import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { Login } from '../../interfaces/Login';
import { WamEntities } from '../../interfaces/Entities';
import { EntitiesService } from '../../services/Entities.service';
import { UtilsService } from '../../utils.service';

@Component({
    selector: 'app-sign-in',
    imports: [MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    isError: boolean = false;
    wamEntity: WamEntities  | null = null;
    entity: WamEntities | null = null;
   

    constructor(
        private entityService: EntitiesService, 
        private fb: FormBuilder,
        private router: Router,
        private utilsService: UtilsService
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
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
            
            this.entityService.login(login).subscribe((data: WamEntities) => {
                if(data == null)
                    this.isError = true;
                else
                {
                    this.entity! = data;
                    localStorage.setItem('authToken', this.utilsService.generateToken());
                    localStorage.setItem('entity', JSON.stringify(this.entity!));
                    this.router.navigate(['/locations']);
                }
            });
            
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }

    ngOnInit(): void {
        const token = localStorage.getItem('authToken');
        if (token) 
          this.router.navigate(['/locations']);
    }
   
}