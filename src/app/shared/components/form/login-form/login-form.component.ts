import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

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
  loading = signal<boolean>(false);

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

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  onSubmit() {
    const { email, password } = this.loginForm.value
    this.loading.set(true)
    if (!email || email.trim() === "" || !password || password.trim() === "") {
      console.warn('Invalid login details provided')
      this.loading.set(false)
      return
    }

    return this.userService.login({
      email,
      password
    })
    .pipe(finalize(() => {
      this.loading.set(false);
      const hasLoggedIn = this.userService.isLoggedIn();
      if (hasLoggedIn) this.router.navigate(['/main']);
    }))
    .subscribe()
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
