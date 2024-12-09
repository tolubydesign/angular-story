import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterFormComponent } from '@components/form/register-form/register-form.component';

@Component({
    selector: 'app-register',
    imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, RegisterFormComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
