import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
import { GlobalfunctionService } from 'src/app/service/globalfunction.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-view-teachers',
  templateUrl: './view-teachers.component.html',
  styleUrls: ['./view-teachers.component.css']
})
export class ViewTeachersComponent {
  displayedColumns: string[] = ['select','firstName', 'lastName', 'email', 'mobNo', 'actions'];
  dataSource = new MatTableDataSource<Teacher>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private httpClient: HttpClient, private router: Router, private globalFn: GlobalfunctionService) {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    const Authorization = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + Authorization
    });
    this.httpClient.get<{ status: string, message: string, data: any, datas: Teacher[] }>('http://localhost:8080/getTeachersList', { headers }

    ).pipe(
      catchError(err => {
        if (err.status == 500) {
          alert("Internal server error")
        } else if (err.status == 0) {
          console.log('api server down');
        } else if (err.status == 401) {
          this.globalFn.sessionLogout();
        }
        return throwError(() => new Error(err['name']));
      })
    ).subscribe((response) => {
      const { message, datas } = response;
      if (message === "Data fetched") {
        this.dataSource.data = datas;;
      } else {
        this.dataSource.data = [];
      }
    })
  }

  selection = new SelectionModel<Teacher>(true, []);

  /** Whether the number of selected elements matches the total number of rows */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Whether the selection is indeterminate */
  isIndeterminate() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  /** Selects all rows if they are not all selected; otherwise clears selection */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

 exportDataAsExcel() {
   const selectedRows = this.selection.selected;

   if (selectedRows.length === 0) {
     alert('No rows selected!');
     return;
   }
   console.log(selectedRows);
   const Authorization = localStorage.getItem('jwt');
   const headers = new HttpHeaders({
     'Authorization': 'Bearer ' + Authorization
   });
   const data = {
     users: selectedRows
   };
   this.httpClient.post('http://localhost:8080/downloadTeacherDetailsAsExcel',data,{
          headers:headers,
          responseType: 'arraybuffer'
   }).subscribe((data:ArrayBuffer) => {
     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
     // Generate a URL for the Blob
     const url = window.URL.createObjectURL(blob);
 
     // Create a link element
     const a = document.createElement('a');
     a.href = url;
 
     // Set the filename for the download
     a.download = 'TeacherDetails.xlsx';
 
     // Programmatically trigger the download
     a.click();
 
    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);
   })
 }

 exportDataAsCSV(){
   const selectedRows = this.selection.selected;

   if (selectedRows.length === 0) {
     alert('No rows selected!');
     return;
   }
   console.log(selectedRows);
   const Authorization = localStorage.getItem('jwt');
   const headers = new HttpHeaders({
     'Authorization': 'Bearer ' + Authorization
   });
   const data = {
     users: selectedRows
   };
   this.httpClient.post('http://localhost:8080/downloadTeacherDetailsAsCSV',data,{
          headers:headers,
          responseType: 'arraybuffer'
   }).subscribe((data:ArrayBuffer) => {
     const blob = new Blob([data], { type: 'text/csv' });
  
     // Generate a URL for the Blob
     const url = window.URL.createObjectURL(blob);
 
     // Create a link element
     const a = document.createElement('a');
     a.href = url;
 
     // Set the filename for the download
     a.download = 'TeacherDetails.csv';
 
     // Programmatically trigger the download
     a.click();
 
    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);
   })
 }

 exportDataAsPDF(){
   const selectedRows = this.selection.selected;

   if (selectedRows.length === 0) {
     alert('No rows selected!');
     return;
   }
   const Authorization = localStorage.getItem('jwt');
   const headers = new HttpHeaders({
     'Authorization': 'Bearer ' + Authorization
   });
   const data = {
     users: selectedRows
   };
   this.httpClient.post('http://localhost:8080/downloadTeacherDetailsAsPDF',data,{
          headers:headers,
          responseType: 'arraybuffer'
   }).subscribe((data:ArrayBuffer) => {
     const blob = new Blob([data], { type: 'application/pdf' });
  
     // Generate a URL for the Blob
     const url = window.URL.createObjectURL(blob);
 
     // Create a link element
     const a = document.createElement('a');
     a.href = url;
 
     // Set the filename for the download
     a.download = 'TeacherDetails.pdf';
 
     // Programmatically trigger the download
     a.click();
 
    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);
   })
 }


  readonly dialog = inject(MatDialog);

  openDialog(data: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDetails(data);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editDetails(row: any) {
    this.router.navigate(['/edit-details'], { state: { data: row, option: 'edit' } });
  }

  viewDetails(row: any) {
    console.log(row);
    this.router.navigate(['/view-details'], { state: { data: row, option: 'view' } });
  }

  showDeletePopup(data: any) {
    this.openDialog(data);
  }

  deleteDetails(data: any) {
    const teacherId = data.teacherId;
    const Authorization = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + Authorization
    });
    this.httpClient.delete(`http://localhost:8080/deleteTeacher/${teacherId}`, { headers }
    ).pipe(
      catchError(err => {
        if (err.status == 500) {
          alert("Internal server error")
        } else if (err.status == 0) {
          console.log('api server down');
        } else if (err.status == 401) {
          this.globalFn.sessionLogout();
        }
        return throwError(() => new Error(err['name']));
      })
    ).subscribe((data: any) => {
      console.log(data);
      if (data['status'] == 'success') {

      } else {
        alert(data['message']);
      }
    })
  }

}

export interface Teacher {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobNo: string;
  password: string;
  role: string;
}