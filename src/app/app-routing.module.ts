import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './signin/login/login.component';
import { SignupComponent } from './signup/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { StudentSignupComponent } from './signup/student-signup/student-signup.component';
import { ViewStudentsComponent } from './table/view-students/view-students.component';
import { TeacherSignupComponent } from './signup/teacher-signup/teacher-signup.component';
import { ViewTeachersComponent } from './table/view-teachers/view-teachers.component';
import { DetailFormComponent } from './form/detail-form/detail-form.component';
import { WebsocketComponent } from './websocket/websocket/websocket.component';
import { ViewDetailComponent } from './form/view-detail/view-detail.component';
import { AuthGuardService } from './service/auth-guard.service';
import { OtpLoginComponent } from './signin/otp-login/otp-login.component';
import { OtpLoginDialogComponent } from './dialog/otp-login-dialog/otp-login-dialog.component';
import { DebounceComponent } from './debounce/debounce.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'email-login',component:OtpLoginComponent},
  {path:'register',component:SignupComponent},
  {path:'otp',component:OtpLoginDialogComponent},
  {path:'dashboard',component:DashboardComponent, canActivate: [AuthGuardService],children:[
    {path:'student-register',component:StudentSignupComponent}]
  },
  {path:'student-register',component:StudentSignupComponent, canActivate: [AuthGuardService]},
  {path:'teacher-register',component:TeacherSignupComponent, canActivate: [AuthGuardService]},
  {path:'view-student',component:ViewStudentsComponent, canActivate: [AuthGuardService]},
  {path:'view-teachers',component:ViewTeachersComponent, canActivate: [AuthGuardService]},
  {path:'edit-details',component:DetailFormComponent, canActivate: [AuthGuardService]},
  {path:'view-details',component:ViewDetailComponent, canActivate: [AuthGuardService]},
  {path:'websocket',component:WebsocketComponent},
  {path:'debounce',component:DebounceComponent},
  {path: '',redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
