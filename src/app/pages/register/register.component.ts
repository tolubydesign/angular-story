import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterFormComponent } from '@components/form/register-form/register-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

}
