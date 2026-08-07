
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { RegisterFormComponent } from '@components/form/register-form/register-form.component';

@Component({
    selector: 'app-register',
    imports: [RouterLink, RouterModule, RegisterFormComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
