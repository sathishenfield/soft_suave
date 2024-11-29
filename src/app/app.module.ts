import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RecaptchaModule } from "ng-recaptcha";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup/signup.component';
import { StorageService } from './service/storage.service';
import { LoginComponent } from './signin/login/login.component';
import { LoginDialogComponent } from './dialog/login-dialog/login-dialog.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { StudentSignupComponent } from './signup/student-signup/student-signup.component';
import { TeacherSignupComponent } from './signup/teacher-signup/teacher-signup.component';
import { ViewStudentsComponent } from './table/view-students/view-students.component';
import { ViewTeachersComponent } from './table/view-teachers/view-teachers.component';
import { DetailFormComponent } from './form/detail-form/detail-form.component';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
import { WebsocketComponent } from './websocket/websocket/websocket.component';
import { StompRService, StompService } from '@stomp/ng2-stompjs';
import { WebsocketService } from './service/websocket.service';
import { ViewDetailComponent } from './form/view-detail/view-detail.component';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { DialogWithoutComponent } from './dialog/dialog-without/dialog-without.component';
import { CalculateAgePipe } from './pipe/calculate-age.pipe';
import { OtpLoginComponent } from './signin/otp-login/otp-login.component';
import { OtpLoginDialogComponent } from './dialog/otp-login-dialog/otp-login-dialog.component';
import { DebounceComponent } from './debounce/debounce.component';
import { DebounceTimeComponent } from './debounce-time/debounce-time.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    LoginDialogComponent,
    DashboardComponent,
    StudentSignupComponent,
    TeacherSignupComponent,
    ViewStudentsComponent,
    ViewTeachersComponent,
    DetailFormComponent,
    DeleteDialogComponent,
    WebsocketComponent,
    ViewDetailComponent,
    DialogWithoutComponent,
    CalculateAgePipe,
    OtpLoginComponent,
    OtpLoginDialogComponent,
    DebounceComponent,
    DebounceTimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatMenuModule,
    MatCheckboxModule,
    RecaptchaModule
  ],
  providers: [StorageService, StompRService, WebsocketService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
    // { provide: StompService, useExisting: StompRService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
