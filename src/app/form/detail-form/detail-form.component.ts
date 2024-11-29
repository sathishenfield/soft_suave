import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { format } from 'date-fns';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


import { LoginDialogComponent } from 'src/app/dialog/login-dialog/login-dialog.component';
import { catchError, map, Observable, of, startWith, throwError, timeout } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { GlobalfunctionService } from 'src/app/service/globalfunction.service';
import { CalculateAgePipe } from 'src/app/pipe/calculate-age.pipe';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.css'],
  providers: [CalculateAgePipe]
})
export class DetailFormComponent {
  @Input() userData: any;
  data!: any;
  detailForm!: FormGroup;
  phoneNumberErrorMessage!: String;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills!: Observable<string[]>;
  skills: string[] = [];
  allSkills: string[] = ['Java', 'Angular', 'Javascript', 'Html'];
  hobbies: string[] = [];
  subjects: string[] = ['Tamil', 'Maths', 'Physics', 'English', 'Chemistry', 'Biology'];
  isLoading: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('hobbyInput') hobbyInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private globalFn: GlobalfunctionService,
    private calculateAge:CalculateAgePipe
  ) { }

  ngOnInit(): void {
    this.detailForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, this.alphabeticValidator()]),
      lastName: new FormControl('', [Validators.required, this.alphabeticValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)]),
      dob: new FormControl(''),
      age:new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      hobbie: new FormControl([]),
      skill: new FormControl([]),
      subject: new FormControl([], [Validators.required]),
      contactPerson: new FormControl('', [Validators.required]),
      emergencyPhoneNumber: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required])
    });

    this.filteredSkills = this.detailForm.get('skill')!.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => (skill ? this._filter(skill) : this.allSkills.slice()))
    );

    this.detailForm.get('mobNo')?.valueChanges.subscribe(() => {
      this.updatePhoneNumberErrorMessage();
    });

    // const navigation = this.route.getCurrentNavigation();
    // const state = navigation?.extras.state as { data: any, option: string };
    if (history.state && history.state.data && history.state.option) {
      this.data = history.state.data;
    } else {
      // Optionally handle the case where no data is passed
      console.error('No data found in router state');
    }


    if (this.data) {
      this.skills = this.data.skill;
      this.hobbies = this.data.hobbie;
      this.detailForm.patchValue({
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        mobNo: this.data.mobNo,
        gender: this.data.gender,
        skill: this.data.skill,
        // hobbie:this.data.hobbie,
        dob: new Date(this.data.dob),
        subject: this.data.subject,
        contactPerson: this.data.contactPerson,
        emergencyPhoneNumber: this.data.emergencyPhoneNumber,
        relationship: this.data.relationship,
        address: this.data.address.address,
        country: this.data.address.country,
        state: this.data.address.state,
        city: this.data.address.city
      });
      this.updateAge();
    }

  }

  ngOnChanges(): void {
    // Update the form if userData changes
    if (this.userData) {
      this.skills = this.userData.skill;
      this.hobbies = this.userData.hobbie;
      this.data = this.userData;
      this.detailForm.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        mobNo: this.userData.mobNo,
        gender: this.userData.gender,
        skill: this.userData.skill,
        // hobbie:this.userData.hobbie,
        dob: new Date(this.userData.dob),
        subject: this.userData.subject,
        contactPerson: this.userData.contactPerson,
        emergencyPhoneNumber: this.userData.emergencyPhoneNumber,
        relationship: this.userData.relationship,
        address: this.userData.address.address,
        country: this.userData.address.country,
        state: this.userData.address.state,
        city: this.userData.address.city
      });
      this.updateAge();
    }
  }

  updateAge(): void {
    const dob = this.detailForm.get('dob')?.value;
    if (dob) {
      const calculatedAge = this.calculateAge.transform(dob);
      console.log(calculatedAge);
      this.detailForm.get('age')?.setValue(calculatedAge);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)

    if (value && !this.skills.includes(value)) {
      this.skills.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.detailForm.get('skill')!.setValue(null);
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  addHobby(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.hobbies.includes(value)) {
      this.hobbies.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.detailForm.get('hobbie')!.setValue(null);
  }

  removeHobby(hobby: string): void {
    const index = this.hobbies.indexOf(hobby);

    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;

    if (!this.skills.includes(value)) {
      this.skills.push(value);
    }

    this.skillInput.nativeElement.value = '';
    this.detailForm.get('skill')!.setValue(null);
  }

  private _filter(value: string): string[] {
    if (value) {
      // const filterValue = value.toLowerCase();
      return this.allSkills.filter(skill => skill.toLowerCase().includes(value));
    }
    return [];
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

  updatePhoneNumberErrorMessage(): void {
    const control = this.detailForm.get('mobNo');
    if (control?.hasError('required')) {
      this.phoneNumberErrorMessage = 'Phone Number is required';
    } else if (control?.hasError('pattern')) {
      this.phoneNumberErrorMessage = 'Phone Number must contain digits only';
    } else if ((control?.hasError('minlength') || control?.hasError('maxlength')) && !control?.hasError('pattern')) {
      this.phoneNumberErrorMessage = 'Phone Number must contain exactly 10 digits';
    } else {
      this.phoneNumberErrorMessage = '';
    }
  }

  // when submitting the register form
  update() {
    console.log(this.detailForm.get('hobbie')?.valid);
    if (this.detailForm.valid && this.detailForm.dirty) {
      const Authorization = localStorage.getItem('jwt');
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + Authorization
      });
      var dob = new Date(this.detailForm.get('dob')?.value);
      const formattedDate = format(dob, 'MM/dd/yyyy');
      if (this.data.role === "ROLE_ADMIN") {
        // this.userType = "admin";
        const data = {
          "firstName": this.detailForm.get('firstName')?.value,
          "lastName": this.detailForm.get('lastName')?.value,
          "email": this.detailForm.get('email')?.value,
          "mobNo": this.detailForm.get('mobNo')?.value,
          "dob": formattedDate,
          "gender": this.detailForm.get('gender')?.value,
          "hobbie": this.hobbies,
          "skill": this.skills,
          "subject": this.detailForm.get('subject')?.value,
          "contactPerson": this.detailForm.get('contactPerson')?.value,
          "emergencyPhoneNumber": this.detailForm.get('emergencyPhoneNumber')?.value,
          "relationship": this.detailForm.get('relationship')?.value,
          "address": {
            "address": this.detailForm.get('address')?.value,
            "country": this.detailForm.get('country')?.value,
            "state": this.detailForm.get('state')?.value,
            "city": this.detailForm.get('city')?.value
          }
        }
        this.httpClient.post('http://localhost:8080/updateUserDetails', data, { headers }
        ).pipe(
          catchError(err => {
            if (err.status == 500) {
              alert(err.error['error']);
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
            this.detailForm.markAsUntouched();
            this.detailForm.markAsPristine();
            this.openSnackBar('User Updated successfully!!');
          } else {
            alert(data['message']);
          }
        });
      } else if (this.data.role === "ROLE_STUDENT") {
        // this.userType = "student";
        const data = {
          "studentId": this.data.studentId,
          "firstName": this.detailForm.get('firstName')?.value,
          "lastName": this.detailForm.get('lastName')?.value,
          "email": this.detailForm.get('email')?.value,
          "mobNo": this.detailForm.get('mobNo')?.value,
          "dob": formattedDate,
          "gender": this.detailForm.get('gender')?.value,
          "hobbie": this.hobbies,
          "skill": this.skills,
          "subject": this.detailForm.get('subject')?.value,
          "contactPerson": this.detailForm.get('contactPerson')?.value,
          "emergencyPhoneNumber": this.detailForm.get('emergencyPhoneNumber')?.value,
          "relationship": this.detailForm.get('relationship')?.value,
          "address": {
            "address": this.detailForm.get('address')?.value,
            "country": this.detailForm.get('country')?.value,
            "state": this.detailForm.get('state')?.value,
            "city": this.detailForm.get('city')?.value
          }
        }
        this.httpClient.post('http://localhost:8080/updateStudentDetails', data, { headers }
        ).pipe(
          catchError(err => {
            if (err.status == 500) {
              alert(err.error['error']);
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
            this.isLoading = true;
            setTimeout(() => {
              this.detailForm.reset();
              this.isLoading = false;
              this.router.navigate(['/view-student']);
            }, 2000)
          } else {
            alert(data['message']);
          }
        });
      } else {
        // this.userType = "teacher";
        const data = {
          "teacherId": this.data.teacherId,
          "firstName": this.detailForm.get('firstName')?.value,
          "lastName": this.detailForm.get('lastName')?.value,
          "email": this.detailForm.get('email')?.value,
          "mobNo": this.detailForm.get('mobNo')?.value,
          "dob": formattedDate,
          "gender": this.detailForm.get('gender')?.value,
          "hobbie": this.hobbies,
          "skill": this.skills,
          "subject": this.detailForm.get('subject')?.value,
          "contactPerson": this.detailForm.get('contactPerson')?.value,
          "emergencyPhoneNumber": this.detailForm.get('emergencyPhoneNumber')?.value,
          "relationship": this.detailForm.get('relationship')?.value,
          "address": {
            "address": this.detailForm.get('address')?.value,
            "country": this.detailForm.get('country')?.value,
            "state": this.detailForm.get('state')?.value,
            "city": this.detailForm.get('city')?.value
          }
        }
        this.httpClient.post('http://localhost:8080/updateTeacherDetails', data, { headers }
        ).pipe(
          catchError(err => {
            if (err.status == 500) {
              alert(err.error['error']);
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
            this.isLoading = true;
            setTimeout(() => {
              this.detailForm.reset();
              this.isLoading = false;
              this.router.navigate(['/view-teachers']);
            }, 2000)
          } else {
            alert(data['message']);
          }
        });
      }

    } else {
      if (this.detailForm.pristine && this.detailForm.valid) {
        this.openSnackBar('No changes in document');
      } else if (this.detailForm.invalid) {
        this.openSnackBar('Fill the required field');
      }
      this.detailForm.markAllAsTouched();
      console.log("Form is invalid");
    }
  }


}
