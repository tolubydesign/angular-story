import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { emailValidation, forbiddenPasswordValidator } from '@shared/utils/validation';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  formLabelClassName = "form--label font-bold text-sm text-[#24110C] mb-2";
  formInputClassName = "form--input-field text-sm font-medium bg-transparent rounded-md border-[3px] border-[#413F5A] py-2 px-3 w-full";
  visibleEyeIcon = "/assets/icons/visibility_FILL0_24.svg";
  invisibleEyeIcon = "/assets/icons/visibility_off_24.svg";
  eyeIcon = signal<string>(this.visibleEyeIcon);
  passwordType = signal<'password' | 'text'>("password");

  registerUserForm = new FormGroup({
    forename: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      emailValidation(),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      forbiddenPasswordValidator(/password/i),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      forbiddenPasswordValidator(/password/i),
    ]),
    rememberMe: new FormControl(false),
  });

  submitForm() {
    console.log('form submitted', this.registerUserForm);
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
