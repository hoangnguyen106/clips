import { AbstractControl, ValidationErrors } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get('password');
      const matchingControl = group.get('confirm_password');
      if (!control || !matchingControl) {
        console.error('asdasdsadasds');
        return { controlNotFound: false };
      }

      const error =
        control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    };
  }
}
