import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/form/login-form/login-form.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule, LoginFormComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  panelImage = '/assets/images/login-screen-asset-collage.jpg';
}
