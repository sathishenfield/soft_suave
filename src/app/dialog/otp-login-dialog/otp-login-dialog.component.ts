import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-login-dialog',
  templateUrl: './otp-login-dialog.component.html',
  styleUrls: ['./otp-login-dialog.component.css']
})
export class OtpLoginDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OtpLoginDialogComponent>);
  otp:string = '';
  @Output() otpEntered = new EventEmitter<string>();

  submitOtp() {
    if (this.otp && this.otp.length === 6) {
     this.otpEntered.emit(this.otp);
    } // Pass OTP value back to parent
  }
}
