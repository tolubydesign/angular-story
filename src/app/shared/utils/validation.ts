import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

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
