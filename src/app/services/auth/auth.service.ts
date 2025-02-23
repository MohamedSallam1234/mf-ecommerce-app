import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.authApiUrl;
  private http = inject(HttpClient);
  private currentUserEmail: string | null = null;
  private currentUser = signal<any>(null);

  constructor() {
    console.log('AuthService Initialized');
    console.log('API URL:', this.apiUrl);
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  signin(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/signin`, user, { headers }).pipe(
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
      .post(`${this.apiUrl}/signup`, user, {
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

  setCurrentUserEmail(email: string) {
    this.currentUserEmail = email;
  }

  getCurrentUserEmail(): string {
    return this.currentUserEmail || 'guest';
  }

  clearCurrentUser() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.currentUserEmail = null;
  }

  async isAdmin(): Promise<boolean> {
    try {
      const user = this.currentUser();
      console.log('Current user role:', user?.role);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  setCurrentUser(user: any) {
    console.log('Setting current user:', user);
    this.currentUser.set(user);
    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  logout() {
    this.clearCurrentUser();
  }
}
