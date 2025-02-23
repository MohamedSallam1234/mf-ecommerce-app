import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminApiUrl = environment.adminApiUrl;

  constructor(private http: HttpClient) {}

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.adminApiUrl}/products`, product);
  }

  updateProduct(_id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(
      `${this.adminApiUrl}/products/${_id}`,
      product
    );
  }

  deleteProduct(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/products/${_id}`);
  }
}
