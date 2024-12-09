import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterFormComponent } from '@components/form/register-form/register-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
