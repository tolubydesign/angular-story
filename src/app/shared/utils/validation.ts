import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

/** */
export function forbiddenPasswordValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

/**
 * Validation to confirm form email provided is valid.
 */
export function emailValidation(): ValidatorFn {
  let emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/i;
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !emailRegex.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

export function passwordPattern(): ValidatorFn {
  return Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
}

/**
 * Generic Form Group input matching field.
 * ...
 * @param controlName 
 * @param matchingControlName 
 * @param errorMessage 
 * @returns 
 */
export function inputFieldsMatch(controlName: string, matchingControlName: string, errorMessage: string): ValidatorFn {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (matchingControl!.errors && !matchingControl!.errors?.['matchingFieldsValidator']) {
      return null;
    }

    if (control!.value !== matchingControl!.value) {
      const error = { matchingFieldsValidator: errorMessage };
      matchingControl!.setErrors(error);
      return error;
    } else {
      matchingControl!.setErrors(null);
      return null;
    }
  };
}

/**
 * Password matching Form Group Validator.
 * ... 
 * @param controlName 
 * @param matchingControlName 
 * @returns 
 */
export function passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
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