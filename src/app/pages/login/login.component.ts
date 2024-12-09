import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/form/login-form/login-form.component';
import {} from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-login',
    imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, LoginFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  panelImage = "/assets/images/login-screen-asset-collage.jpg"
}
