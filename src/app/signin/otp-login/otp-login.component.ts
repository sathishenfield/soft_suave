import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OtpLoginDialogComponent } from 'src/app/dialog/otp-login-dialog/otp-login-dialog.component';


@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css']
})
export class OtpLoginComponent {

  emailForm!: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isLoading: boolean = false;
  readonly dialog = inject(MatDialog);
  constructor(private httpClient: HttpClient, private snackbar: MatSnackBar, private route: Router) {

  }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3 * 1000,
    });
  }

  openOtpDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(OtpLoginDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    const componentInstance = dialogRef.componentInstance;
    componentInstance.otpEntered.subscribe((otp: string) => {
      this.verifyOtp(otp, dialogRef);
    });
  }

  generateOtp() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;
      this.isLoading = true;
      this.httpClient.get(`http://localhost:8080/generateOtp/${email}`

      ).subscribe((data: any) => {
        this.isLoading = false;
        if (data['status'] === 'success') {
          this.openOtpDialog('10', '2000');
        }else{
          this.openSnackBar('Email id is not registered')
        }
      });
    }
  }

  verifyOtp(Otp: string, dialogRef: MatDialogRef<OtpLoginDialogComponent>) {
    if (Otp) {
      const data = {
        otp: Otp,
        email: this.emailForm.get('email')?.value
      }
      this.isLoading = true;
      this.httpClient.post('http://localhost:8080/verifyOtp', data

      ).subscribe((data: any) => {
        
        if (data['status'] === 'success') {
          dialogRef.close();
          setTimeout(() => {
            this.isLoading = false;
            localStorage.setItem('jwt',data['jwttoken']);
            localStorage.setItem('schoolId',data['schoolId']);
            localStorage.setItem('refreshToken',data['refreshToken']);
            this.route.navigate(['/dashboard']);
          }, 1500);   
        } else if (data['status'] === 'failure') {
          this.isLoading = false;
          this.openSnackBar(data['message']);
        }
      });
    }
  }


}
