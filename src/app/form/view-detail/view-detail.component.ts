import { Component, ElementRef, ViewChild} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css'],
  // styles: [`
  //   .app-view-detail .mat-mdc-text-field-wrapper.mdc-text-field {
  //     height: 40px !important;
  //   }
  // `]
})
export class ViewDetailComponent {
  skills: string[] = [];
  hobbies: string[] = [];
  subjects: string[] =[];
  firstName: any;
  lastName: any;
  email: any;
  mobNo: any;
  gender: any;
  dob: any;
  contactPerson: any;
  emergencyPhoneNumber: any;
  relationship: any;
  address: any;
  country: any;
  state: any;
  city: any;
  hobbie!: string[];

  constructor(

  ) { }

  ngOnInit(): void {
    // const navigation = this.route.getCurrentNavigation();
    // const state = navigation?.extras.state as { data: any, option: string };
    if (history.state && history.state.data && history.state.option) {
      const data = history.state.data;
      console.log(data);
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.mobNo = data.mobNo;
      this.gender = data.gender;
      this.skills = data.skill;
      this.dob = new Date(data.dob);
      this.subjects = data.subject;
      this.contactPerson = data.contactPerson;
      this.emergencyPhoneNumber = data.emergencyPhoneNumber;
      this.relationship = data.relationship;
      this.address = data.address.address;
      this.country = data.address.country;
      this.state = data.address.state;
      this.city = data.address.city;
      this.hobbies = data.hobbie;
    } else {
      // Optionally handle the case where no data is passed
      console.error('No data found in router state');
    }
  }

}
