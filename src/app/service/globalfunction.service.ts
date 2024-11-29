import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalfunctionService {

  constructor(private router:Router) { }

  sessionLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
