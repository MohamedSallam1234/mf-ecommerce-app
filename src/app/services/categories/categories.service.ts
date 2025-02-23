import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timeout, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesApiUrl = environment.categoriesApiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getCategories(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http
      .get<string[]>(`${this.categoriesApiUrl}/categories`, { headers })
      .pipe(timeout(10000), catchError(this.handleError));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http
      .get<Product[]>(
        `${this.categoriesApiUrl}/products/category/${category}`,
        { headers }
      )
      .pipe(
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
