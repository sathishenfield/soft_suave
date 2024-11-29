import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt') || null;
    return !!token; // Returns true if token exists
  }

  refreshToken(): Observable<string> {
    // Replace with your actual refresh token endpoint and logic
    const data = {
      token: localStorage.getItem('refreshToken')
    }
    return this.httpClient.post<any>('http://localhost:8080/refresh-token', data)
      .pipe(
        map(response => {
          const token = response.jwttoken;
          localStorage.setItem('jwt', token);
          return token;
        })
      );
  }
}
