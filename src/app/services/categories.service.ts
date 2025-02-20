import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { map, Observable, timeout, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);

  constructor() {}

  getCategories(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/categories`)
      .pipe(timeout(10000), catchError(this.handleError));
  }

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/category/${category}`).pipe(
      timeout(10000),
      tap((products) => console.log('Products for category:', products)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
