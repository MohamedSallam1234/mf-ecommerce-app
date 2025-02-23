import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    console.log('AdminGuard: Checking if user is admin');
    const isAdmin = await this.authService.isAdmin();
    console.log('AdminGuard: isAdmin result:', isAdmin);

    if (!isAdmin) {
      console.log('AdminGuard: User is not admin, redirecting to home');
      this.router.navigate(['/tabs/home']);
      return false;
    }
    console.log('AdminGuard: User is admin, allowing access');
    return true;
  }
}
