import { Component, inject } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient,HttpHeaders } from '@angular/common/http'

import { LoginDialogComponent } from 'src/app/dialog/login-dialog/login-dialog.component';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-teacher-signup',
  templateUrl: './teacher-signup.component.html',
  styleUrls: ['./teacher-signup.component.css']
})
export class TeacherSignupComponent {

  signinForm!: FormGroup;
  phoneNumberErrorMessage!: String;
  
  constructor(
    public router: Router,
    public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      firstNameControl: new FormControl('', [Validators.required, this.alphabeticValidator()]),
      lastNameControl: new FormControl('', [Validators.required, this.alphabeticValidator()]),
      emailControl: new FormControl('', [Validators.required, Validators.email],[this.emailAlreadyExistValidator()]),
      phoneNumberControl: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)], [this.mobileNumberAlreadyExistValidator()]),
      addressControl:new FormControl(''),
      countryControl:new FormControl(''),
      stateControl:new FormControl(''),
      cityControl:new FormControl(''),
      passwordControl: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      rePasswordControl: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator() });

    this.signinForm.get('phoneNumberControl')?.valueChanges.subscribe(() => {
      this.updatePhoneNumberErrorMessage();
    });
  }

  readonly dialog = inject(MatDialog);

  // to open the popup after succcessful registration
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LoginDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  // to verify the name contains only alphabets
  alphabeticValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-Z]+$/.test(control.value);
      return valid ? null : { 'alphabetic': { value: control.value } };
    };
  }

  // to verify the passwords are equal
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get('passwordControl');
      const matchingControl = formGroup.get('rePasswordControl');

      if (matchingControl?.dirty && control?.value == '') {
        control?.setErrors({ required: true });
        control.markAsTouched();
      }

      if (matchingControl?.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  // to verify mobile number already exist
  mobileNumberAlreadyExistValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.httpClient.get<{ message: string, status: string }>(`http://localhost:8080/checkMobNo/${control.value}`).pipe(
        map(response => {
          if (response.message == 'Mobile Number already Exists') {
            return { mobileTaken: true };
          }
          return null;
        }),
        catchError(() => of(null))
        // catchError((err) => {
        //   return throwError(() => new Error(err['name']))
        // }) 
      );
    };
  }

  // to verify email already exist
  emailAlreadyExistValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.httpClient.get<{ message: string, status: string }>(`http://localhost:8080/checkEmail/${control.value}`).pipe(
        map(response => {
          if (response.message == 'Email already Exists') {
            return { emailTaken: true };
          }
          return null;
        }),
        catchError(() => of(null))
        // catchError((err) => {
        //   return throwError(() => new Error(err['name']))
        // }) 
      );
    };
  }

  updatePhoneNumberErrorMessage(): void {
    const control = this.signinForm.get('phoneNumberControl');
    if (control?.hasError('required')) {
      this.phoneNumberErrorMessage = 'Phone Number is required';
    } else if (control?.hasError('mobileTaken')) {
      this.phoneNumberErrorMessage = 'Phone Number already exist';
    } else if (control?.hasError('pattern')) {
      this.phoneNumberErrorMessage = 'Phone Number must contain digits only';
    } else if ((control?.hasError('minlength') || control?.hasError('maxlength')) && !control?.hasError('pattern')) {
      this.phoneNumberErrorMessage = 'Phone Number must contain exactly 10 digits';
    } else {
      this.phoneNumberErrorMessage = '';
    }
  }

  // when submitting the register form
  signin() {
    this.updatePhoneNumberErrorMessage();
    if (this.signinForm.valid) {
      const data = {
        "firstName": this.signinForm.get('firstNameControl')?.value,
        "lastName": this.signinForm.get('lastNameControl')?.value,
        "email": this.signinForm.get('emailControl')?.value,
        "mobNo": this.signinForm.get('phoneNumberControl')?.value,
        "password": this.signinForm.get('passwordControl')?.value,
        "role":"ROLE_TEACHER",
        "address":{
            "address":this.signinForm.get('addressControl')?.value,
            "country":this.signinForm.get('countryControl')?.value,
            "state":this.signinForm.get('stateControl')?.value,
            "city":this.signinForm.get('cityControl')?.value
        }
      }
      const Authorization = localStorage.getItem('jwt');
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+Authorization 
      });
      console.log(data);
      this.httpClient.post('http://localhost:8080/register-teacher', data,{headers}
      ).pipe(
        catchError(err => {
          if (err.status == 500) {
            alert(err.error['error']);
          } else if (err.status == 0) {
            console.log('api server down');
          }
          return throwError(() => new Error(err['name']));
        })
      ).subscribe((data: any) => {
        console.log(data);
        if (data['status'] == 'success') {
          this.signinForm.reset();
          this.router.navigate(['/view-teachers']);
        } else {
          alert(data['message']);
        }
      });
    } else {
      console.log('form is invalid');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
