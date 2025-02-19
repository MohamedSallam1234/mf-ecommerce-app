import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints;
  private http = inject(HttpClient);

  constructor() {
    console.log('AuthService Initialized');
    console.log('API URL:', this.apiUrl);
    console.log('Endpoints:', this.endpoints);
  }

  signin(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.apiUrl}${this.endpoints.signin}`, user, { headers })
      .pipe(
        timeout(10000), // 10 seconds timeout
        catchError((error) => {
          console.error('Error in signin request:', error);
          return throwError(() => error);
        })
      );
  }

  signup(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post(`${this.apiUrl}${this.endpoints.signup}`, user, {
        headers,
      })
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Error in signup request:', error);
          return throwError(() => error);
        })
      );
  }
}
