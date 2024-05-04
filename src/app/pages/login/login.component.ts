import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/form/login-form/login-form.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  panelImage = "/assets/images/login-screen-asset-collage.jpg"
}
