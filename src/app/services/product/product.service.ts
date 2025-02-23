import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productApiUrl = environment.productApiUrl;
  private http = inject(HttpClient);

  constructor() {
    console.log('ProductService Initialized');
    console.log('API URL:', this.productApiUrl);
  }

  getProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http.get<any[]>(`${this.productApiUrl}`, { headers }).pipe(
      timeout(10000), // 10 seconds timeout
      map((response) => response),
      tap((products) => console.log('Products:', products)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getProducts request:', error);
        return throwError(() => error);
      })
    );
  }

  getProductById(_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http.get<any>(`${this.productApiUrl}/${_id}`, { headers }).pipe(
      timeout(10000),
      tap((product) => console.log('Product:', product)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getProduct request:', error);
        return throwError(() => error);
      })
    );
  }
}
