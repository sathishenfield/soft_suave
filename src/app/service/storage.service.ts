import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private signinKey = "signinData";

  constructor() { }

  saveSigninFormData(formData:any):void{
    let data = this.getSigninFormData();
    data.push(formData);
    localStorage.setItem(this.signinKey,JSON.stringify(data));
  }

  getSigninFormData():any[]{
      const data = localStorage.getItem(this.signinKey);
      return data ? JSON.parse(data) : [];
  }
}
