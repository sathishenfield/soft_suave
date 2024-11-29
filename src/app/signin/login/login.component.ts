declare var google: any;
import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signinForm!: FormGroup;
  hide = true;
  captchaResolved = true;
  captchaResponse: string | undefined;
  siteKey:string = "6LcekywqAAAAAGpVMXrxXzgRd22c2bor5h3jhP8h";

  constructor(
    private router: Router, 
    public httpClient: HttpClient,
    private ngZone: NgZone
  ){}

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      userNameControl: new FormControl('', [Validators.required]),
      passwordControl: new FormControl('', [Validators.required])
    });

    google.accounts.id.initialize({
      client_id: '322273476755-3eie4rhg6sgvcqm623f9khc71dahotgc.apps.googleusercontent.com',
      callback: ((resp:any) => {
        this.ngZone.run(() => {
          console.log(resp);
          this.router.navigate(['/dashboard']);
        });
      })  
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: "filled_blue",         // Options: "outline", "filled_blue", "filled_black"
      size: 'large',            // Options: "small", "medium", "large"
      shape: 'rectangle'
      // text: 'signin_with'
    });
  }

  onCaptchaResolved(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    this.captchaResolved = true;
    console.log(`Captcha resolved with response: ${captchaResponse}`);
  }

  // emailOrPhoneNumberValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const value = control.value;
  //     if (!value) {
  //       return null;
  //     }
  //     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //     const phonePattern = /^\d{10}$/;

  //     const isOnlyDigits = /^\d+$/.test(value);
  //     if (isOnlyDigits) {
  //       if (phonePattern.test(value)) {
  //         return null;
  //       } else {
  //         return { 'invalidPhoneNumber': true };
  //       }
  //     } else {
  //       if (emailPattern.test(value)) {
  //         return null;
  //       } else {
  //         return { 'invalidEmail': true };
  //       }
  //     }
  //   };
  // }


  signIn() {
    if (this.signinForm.valid && this.captchaResolved) {
      const data = {
        email: this.signinForm.get('userNameControl')?.value,
        password: this.signinForm.get('passwordControl')?.value
      }
        this.httpClient.post('http://localhost:8080/login', data

        ).pipe(
          catchError(err => {
            if (err.status == 500) {
              alert("Internal server error")
            } else if (err.status == 0) {
              console.log('api server down');
            }
            return throwError(() => new Error(err['name']));
          })
        ).subscribe((data: any) => {
          if (data['status'] == 'success') {
            this.signinForm.reset();
            localStorage.setItem('jwt',data['jwttoken']);
            localStorage.setItem('schoolId',data['schoolId']);
            localStorage.setItem('refreshToken',data['refreshToken']);
            this.router.navigate(['/dashboard']);
          } else {
            alert(data['message']);
          }
        })
    } else {
      console.log("Form is invalid");
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
