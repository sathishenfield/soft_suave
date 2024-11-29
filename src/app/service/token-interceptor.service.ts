import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GlobalfunctionService } from './globalfunction.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private authService: AuthService, private router: Router, private _snackbar: MatSnackBar,private globalFn:GlobalfunctionService) { }

  openSnackBar(message: string) {
    this._snackbar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 && error.error.message === 'Session expired') {
          return this.authService.refreshToken().pipe(
            switchMap((newToken) => {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(request).pipe(
                catchError((innerError) => {
                  return throwError(() => new Error(innerError.message));
                })
              );
            }),
            catchError(() => {
              // Handle refresh token failure
              this.globalFn.sessionLogout();
              this.openSnackBar('Session expired, Please login...');
              this.router.navigate(['/login']);
              return throwError(() => new Error('Refresh token expired.'));
            })
          );
        } else {
          return throwError(() => new Error(error['name']));
        }
      })
    );
  }
}
