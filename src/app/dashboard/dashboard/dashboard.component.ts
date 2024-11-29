import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { GlobalfunctionService } from 'src/app/service/globalfunction.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userData!:any;

  constructor(private router:Router,private httpClient:HttpClient){
    
  }

  ngOnInit(){
    const Authorization = localStorage.getItem('jwt');
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+Authorization 
      });
      this.httpClient.get<{status: string, message: string, data: any, datas: any[]}>('http://localhost:8080/getUserDetails',{headers}

      ).pipe(
        catchError(err => {
          if (err.status == 500) {
            alert("Internal server error")
          } else if (err.status == 0) {
            console.log('api server down');
          } 
          return throwError(() => new Error(err['name']));
        })
      ).subscribe((response) => {
        const {data} = response;
        this.userData=data;
      })
  }

  addStudent(){
    this.router.navigate(['/student-register'])
  }

  viewStudent(){
    this.router.navigate(['/view-student'])
  }

  addTeacher(){
    this.router.navigate(['/teacher-register'])
  }

  viewTeacher(){
    this.router.navigate(['/view-teachers'])
  }

}
