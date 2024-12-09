import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/form/login-form/login-form.component';
import {} from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  panelImage = "/assets/images/login-screen-asset-collage.jpg"
}
