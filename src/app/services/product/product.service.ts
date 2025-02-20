import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

// interface ProductResponse {
//   status: string;
//   results: number;
//   data: {
//     products: any[];
//   };
// }

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private productApiUrl = environment.productApiUrl;
  private productApiUrl = 'https://fakestoreapi.com/products';
  // private productApiUrl = 'http://localhost:4000/api/products';
  private http = inject(HttpClient);

  constructor() {
    console.log('ProductService Initialized');
    console.log('API URL:', this.productApiUrl);
  }

  getProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.get<any[]>(this.productApiUrl, { headers }).pipe(
      timeout(10000), // 10 seconds timeout
      map((response) => response),
      tap((products) => console.log('Products:', products)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getProducts request:', error);
        return throwError(() => error);
      })
    );
  }
}
