import { UserService } from '@core/services/user/user.service';
import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { emailValidation, forbiddenPasswordValidator, passwordPattern, passwordMatch } from '@shared/utils/validation';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  formLabelClassName = 'form--label font-bold text-sm text-[#24110C] mb-2';
  formInputClassName = 'form--input-field text-sm font-medium bg-transparent rounded-md border-[3px] border-[#413F5A] py-2 px-3 w-full';
  visibleEyeIcon = '/assets/icons/visibility_FILL0_24.svg';
  invisibleEyeIcon = '/assets/icons/visibility_off_24.svg';
  eyeIcon = signal<string>(this.visibleEyeIcon);
  passwordType = signal<'password' | 'text'>('password');
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  registerUserForm = new FormGroup(
    {
      forename: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.minLength(4), emailValidation()]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        // passwordPattern(),
        // forbiddenPasswordValidator(/password/i),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        // passwordPattern(),
        // forbiddenPasswordValidator(/password/i),
      ]),
      rememberMe: new FormControl(false),
    },
    {
      validators: this.passwordMatch('password', 'confirmPassword'),
    }
  );

  constructor(private router: Router, private userService: UserService) {}

  submitForm() {
    this.loading.set(true);

    // clear errors
    this.resetErrorMessage();
    console.log('form submitted', this.registerUserForm);

    const { email, password, confirmPassword, forename, rememberMe, surname } = this.registerUserForm.value;
    // confirm that passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      // Password and Confirm Password don't match
      this.registerUserForm.errors;
    }

    if (
      (!email || email.trim() === '') ||
      (!password || password.trim() === '') ||
      (!forename || forename.trim() === '') ||
      (!surname || surname.trim() === '')
    ) {
      console.warn('Invalid details provided');
      this.registerUserForm.setErrors({ invalidInputs: "invalid details provided. Re-input your details."}, { emitEvent: false });
      this.loading.set(false);
      return;
    }

    return this.userService.register({
      email,
      password,
      forename,
      surname
    })
    .pipe(catchError((error: HttpErrorResponse, caught: Observable<any>) => {
      console.log('error response : error', {error});
      console.log('error response : caught', {caught});
      if (error.status && error.error && typeof error.error === "string") {
        // Show error message.
        this.errorMessage.set(error.error);
        return throwError(() => error);
      }

      return throwError(() => new Error('Something bad happened. Please try again later.'));
    }))
    .pipe(finalize(() => {
      this.loading.set(false);
      const hasLoggedIn = this.userService.isLoggedIn();
      if (hasLoggedIn) this.router.navigate(['/main']);
    }))
    .subscribe()
  }

  passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    };
  }

  switchPasswordType() {
    if (this.passwordType() === 'password') {
      this.passwordType.set('text');
      this.eyeIcon.set(this.invisibleEyeIcon);
    } else {
      this.passwordType.set('password');
      this.eyeIcon.set(this.visibleEyeIcon);
    }
  }

  resetErrorMessage = () => this.errorMessage.set(null);
}
