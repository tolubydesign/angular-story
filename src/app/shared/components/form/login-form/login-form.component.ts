import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  formLabelClassName = "form--label font-bold text-sm text-[#24110C] mb-2";
  formInputClassName = "form--input-field text-sm font-medium bg-transparent rounded-md border-[3px] border-[#413F5A] py-2 px-3 w-full";
  visibleEyeIcon = "/assets/icons/visibility_FILL0_24.svg";
  invisibleEyeIcon = "/assets/icons/visibility_off_24.svg";
  eyeIcon = signal<string>(this.visibleEyeIcon);
  passwordType = signal<'password' | 'text'>("password");

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    rememberMe: new FormControl(false),
  });

  onSubmit() {
    console.log('form submitted', this.loginForm);
  }

  switchPasswordType() {
    if (this.passwordType() === "password") {
      this.passwordType.set("text");
      this.eyeIcon.set(this.invisibleEyeIcon);
    } else {
      this.passwordType.set("password");
      this.eyeIcon.set(this.visibleEyeIcon);
    }
  }
}
